#!/usr/bin/env python3
"""
Generate consumer-friendly names for all 21,524 medical procedures in the
medical-costs-api D1 database.

Strategy:
  1. Fetch all procedures via the public API (paginated).
  2. For each procedure WITHOUT an existing consumer_description, generate a
     human-readable consumer_name using pattern matching + abbreviation expansion.
  3. Write INSERT OR REPLACE SQL split into 500-row chunk files.
  4. Execute each chunk against D1 via wrangler.

Usage:
  python3 scripts/generate-consumer-names.py           # generate + load
  python3 scripts/generate-consumer-names.py --dry-run  # generate only
"""

import json, os, re, subprocess, sys, time, math
from pathlib import Path
from urllib.request import urlopen, Request

API_BASE = "https://medical-costs-api.david-568.workers.dev/api/procedures"
PAGE_SIZE = 200
OUTPUT_DIR = Path("/tmp/consumer-names")
CHUNK_SIZE = 500
DB_NAME = "medical-costs-db"
DRY_RUN = "--dry-run" in sys.argv

# ── CMS abbreviation expansions ──────────────────────────────────────────
# Applied in order; longer/more-specific patterns first.
ABBREV_MAP = [
    # Multi-char slash/symbol patterns
    (r'\bw/o\b', 'without'),
    (r'\bw/', 'with '),
    (r'\bo/p\b', 'outpatient'),
    (r'\bi/p\b', 'inpatient'),
    (r'\bb/m\b', 'bone/muscle'),
    (r'\b(\d+)/>\s*', r'\1 or more '),
    (r'<(\d+)', r'less than \1'),
    (r'\b4/>\b', '4 or more'),
    (r'\b(\d+)\+\b', r'\1 or more'),

    # ── A ──
    (r'\babd\b', 'abdominal'),
    (r'\baddl\b', 'additional'),
    (r'\badmn\b', 'administration'),
    (r'\badv\b', 'advanced'),
    (r'\bamblnc\b', 'ambulance'),
    (r'\bamndcntss\b', 'amniocentesis'),
    (r'\bampj\b', 'amputation'),
    (r'\banes\b', 'anesthesia'),
    (r'\bangio\b', 'angiography'),
    (r'\bant\b', 'anterior'),
    (r'\bapndx\b', 'appendix'),
    (r'\baprats\b', 'apparatus'),
    (r'\barthro\b', 'arthroscopic'),
    (r'\bassmnt\b', 'assessment'),
    (r'\basst\b', 'assisted'),
    (r'\bauthrj\b', 'authorization'),
    (r'\bauto\b', 'autologous'),

    # ── B ──
    (r'\bbilat\b', 'bilateral'),
    (r'\bbio\b', 'biological'),
    (r'\bbk\b', 'back'),
    (r'\bbldr\b', 'bladder'),
    (r'\bbdy\b', 'body'),
    (r'\bbnch\b', 'bench'),
    (r'\bbrchthx\b', 'brachytherapy'),
    (r'\bbx\b', 'biopsy'),

    # ── C ──
    (r'\bcath\b', 'catheter'),
    (r'\bcerv\b', 'cervical'),
    (r'\bchemo\b', 'chemotherapy'),
    (r'\bchckot\b', 'checkout'),
    (r'\bclin\b', 'clinical'),
    (r'\bclotg\b', 'clotting'),
    (r'\bcmmnty\b', 'community'),
    (r'\bcmpd\b', 'compound'),
    (r'\bcmplx\b', 'complex'),
    (r'\bcog\b', 'cognitive'),
    (r'\bcomp\b', 'complex'),
    (r'\bconsltj\b', 'consultation'),
    (r'\bcont\b', 'continuous'),
    (r'\bcool\b', 'cooling'),
    (r'\bcrctj\b', 'correction'),
    (r'\bcrnl\b', 'corneal'),
    (r'\bcrv\b', 'cervical'),

    # ── D ──
    (r'\bdestrj\b', 'destruction'),
    (r'\bdev\b', 'device'),
    (r'\bdiag\b', 'diagnostic'),
    (r'\bdlvr\b', 'delivery'),
    (r'\bdmepos\b', 'durable medical equipment'),
    (r'\bdrg\b', 'drug'),
    (r'\bdx\b', 'diagnostic'),

    # ── E ──
    (r'\belec\b', 'electrical'),
    (r'\belect\b', 'electrode'),
    (r'\bendo\b', 'endoscopic'),
    (r'\bep\b', 'electrophysiology'),
    (r'\beval\b', 'evaluation'),
    (r'\best\b', 'established'),
    (r'\bexam\b', 'examination'),
    (r'\bexc\b', 'excision'),
    (r'\bexcl\b', 'excluding'),
    (r'\bexercs\b', 'exercises'),
    (r'\bexpl\b', 'exploration of'),
    (r'\bext\b', 'extremity'),
    (r'\bextcpsl\b', 'extracapsular'),

    # ── F ──
    (r'\bfac\b', 'facility'),
    (r'\bfb\b', 'foreign body'),
    (r'\bfibulr\b', 'fibular'),
    (r'\bfitg\b', 'fitting'),
    (r'\bflnk\b', 'flank'),
    (r'\bflroscpy\b', 'fluoroscopy'),
    (r'\bfluoro\b', 'fluoroscopy'),
    (r'\bfnctnl\b', 'functional'),
    (r'\bfx\b', 'fracture'),

    # ── G ──
    (r'\bgen\b', 'general'),
    (r'\bgrp\b', 'group'),

    # ── H ──
    (r'\bhi\b', 'high complexity'),
    (r'\bhosp\b', 'hospital'),
    (r'\bhumerl\b', 'humeral'),

    # ── I ──
    (r'\bim\b', 'intramuscular'),
    (r'\bimmun\b', 'immunization'),
    (r'\bincl\b', 'including'),
    (r'\binj\b', 'injection'),
    (r'\binsj\b', 'insertion of'),
    (r'\bint\b', 'internal'),
    (r'\bintcpsl\b', 'intracapsular'),
    (r'\binterp\b', 'interpretation'),
    (r'\bintmd\b', 'intermediate'),
    (r'\bip\b', 'inpatient'),
    (r'\biv\b', 'intravenous'),

    # ── J ──
    (r'\bjnt\b', 'joint'),
    (r'\bjt\b', 'joint'),

    # ── K/L ──
    (r'\blap\b', 'laparoscopic'),
    (r'\blat\b', 'lateral'),
    (r'\blgmnt\b', 'ligament'),
    (r'\blig\b', 'ligament'),
    (r'\blmbr\b', 'lumbar'),
    (r'\blumb\b', 'lumbar'),
    (r'\blwr\b', 'lower'),
    (r'\blt\b', 'left'),

    # ── M ──
    (r'\bmaint\b', 'maintenance'),
    (r'\bmanl\b', 'manual'),
    (r'\bmat\b', 'material'),
    (r'\bmchnl\b', 'mechanical'),
    (r'\bmeas\b', 'measurement'),
    (r'\bmed\b', 'medical'),
    (r'\bmgmt\b', 'management'),
    (r'\bmlgnt\b', 'malignant'),
    (r'\bmnpj\b', 'manipulation under'),
    (r'\bmod\b', 'moderate complexity'),
    (r'\bmoscpic\b', 'microscopic'),
    (r'\bmusc\b', 'muscle'),
    (r'\bmuscl\b', 'muscle'),
    (r'\bmuscskel\b', 'musculoskeletal'),

    # ── N ──
    (r'\bndl\b', 'needle'),
    (r'\bneurom\b', 'neuromuscular'),
    (r'\bnjx\b', 'injection'),
    (r'\bnrv\b', 'nerve'),
    (r'\bnrvs\b', 'nerves'),
    (r'\bnzm\b', 'enzyme'),

    # ── O ──
    (r'\bobs\b', 'observation'),
    (r'\bop\b', 'outpatient'),
    (r'\borthotc\b', 'orthotic'),
    (r'\bostmy\b', 'ostomy'),

    # ── P ──
    (r'\bpath\b', 'pathology'),
    (r'\bperctn\b', 'percutaneous'),
    (r'\bperq\b', 'percutaneous'),
    (r'\bperfm\b', 'performance'),
    (r'\bphy\b', 'physician'),
    (r'\bphys\b', 'physician'),
    (r'\bplmt\b', 'placement'),
    (r'\bpost\b', 'posterior'),
    (r'\bprctn\b', 'percutaneous'),
    (r'\bprep\b', 'preparation'),
    (r'\bprior\b', 'prior'),
    (r'\bproc\b', 'procedure'),
    (r'\bprog\b', 'program'),
    (r'\bprolng\b', 'prolonged'),
    (r'\bpros\b', 'prosthesis'),
    (r'\bprosthtc\b', 'prosthetic'),
    (r'\bprxml\b', 'proximal'),

    # ── Q/R ──
    (r'\bqhp\b', 'qualified health professional'),
    (r'\breactj\b', 'reaction investigation'),
    (r'\breconst\b', 'reconstruction'),
    (r'\breeducj\b', 'reeducation'),
    (r'\brehab\b', 'rehabilitation'),
    (r'\breq\b', 'require'),
    (r'\brmvl\b', 'removal of'),
    (r'\brpr\b', 'repair of'),
    (r'\brt\b', 'right'),

    # ── S ──
    (r'\bsbsq\b', 'subsequent'),
    (r'\bsclp\b', 'scalp'),
    (r'\bsf\b', 'straightforward'),
    (r'\bsho\b', 'shoulder'),
    (r'\bsimpl\b', 'simple'),
    (r'\bsq\b', 'subcutaneous'),
    (r'\bstim\b', 'stimulation'),
    (r'\bsubq\b', 'subcutaneous'),
    (r'\bsubsq\b', 'subsequent'),
    (r'\bsupfc\b', 'superficial'),
    (r'\bsurg\b', 'surgical'),
    (r'\bsvc\b', 'service'),

    # ── T ──
    (r'\btdn\b', 'tendon'),
    (r'\btdns\b', 'tendons'),
    (r'\bther\b', 'therapeutic'),
    (r'\btherp\b', 'therapy'),
    (r'\bthor\b', 'thoracic'),
    (r'\bthrptc\b', 'therapeutic'),
    (r'\btibial\b', 'tibial'),
    (r'\btis\b', 'tissue'),
    (r'\btrnspnt\b', 'transplant'),
    (r'\btx\b', 'treatment'),

    # ── U/V/W ──
    (r'\bunilat\b', 'unilateral'),
    (r'\bupr\b', 'upper'),
    (r'\bvacc\b', 'vaccine'),
    (r'\bvrt\b', 'vertebral'),
    (r'\bvws\b', 'views'),
    (r'\bwhlchr\b', 'wheelchair'),
    (r'\bwnd\b', 'wound'),

    # ── X/Y ──
    (r'\bxmatch\b', 'cross-match'),
    (r'\bxray\b', 'X-ray'),
    (r'\bx-ray\b', 'X-ray'),
    (r'\bxr\b', 'X-ray'),
    (r'\byrs\b', 'years'),
    (r'\byr\b', 'year'),

    # ── Units/time (careful - only when surrounded by digits/context) ──
    (r'\bmin\b', 'minutes'),
    (r'\bhr\b', 'hour'),

    # ── Additional surgical/anatomical ──
    (r'\bactvty\b', 'activity'),
    (r'\bandsc\b', 'endoscopic'),
    (r'\bapplj\b', 'application'),
    (r'\bartcl\b', 'articular'),
    (r'\barthr\b', 'arthroscopy'),
    (r'\baspc\b', 'aspiration'),
    (r'\baspj\b', 'aspiration'),
    (r'\bcntrl\b', 'control'),
    (r'\bcontct\b', 'contact'),
    (r'\bdbrmt\b', 'debridement'),
    (r'\bdvrtclm\b', 'diverticulum'),
    (r'\belctrly\b', 'electrolyte'),
    (r'\bendsc\b', 'endoscopy'),
    (r'\bepidrl\b', 'epidural'),
    (r'\bfasciot\b', 'fasciotomy'),
    (r'\bfixj\b', 'fixation'),
    (r'\bgstrctmy\b', 'gastrectomy'),
    (r'\bhamrtoe\b', 'hammertoe'),
    (r'\bhrnr\b', 'hernia repair'),
    (r'\bimplt\b', 'implant'),
    (r'\bintrvn\b', 'intervention'),
    (r'\bischmia\b', 'ischemia'),
    (r'\blacrml\b', 'lacrimal'),
    (r'\blarngscpy\b', 'laryngoscopy'),
    (r'\blesj\b', 'lesion'),
    (r'\bligj\b', 'ligation'),
    (r'\blmpctmy\b', 'lumpectomy'),
    (r'\blnscpy\b', 'laparoscopy'),
    (r'\bmastect\b', 'mastectomy'),
    (r'\bmenisect\b', 'meniscectomy'),
    (r'\bnephrect\b', 'nephrectomy'),
    (r'\bnplsm\b', 'neoplasm'),
    (r'\boprg\b', 'operating'),
    (r'\bpalm\b', 'palmar'),
    (r'\bpatellar\b', 'patellar'),
    (r'\bpentrg\b', 'penetrating'),
    (r'\bperc\b', 'percutaneous'),
    (r'\bplacmt\b', 'placement'),
    (r'\bplntr\b', 'plantar'),
    (r'\bpnctrj\b', 'puncture'),
    (r'\bprtl\b', 'partial'),
    (r'\brcnstj\b', 'reconstruction'),
    (r'\bredctj\b', 'reduction'),
    (r'\bresctj\b', 'resection'),
    (r'\brevj\b', 'revision'),
    (r'\broscpy\b', 'roscopy'),
    (r'\brotcuff\b', 'rotator cuff'),
    (r'\bscpj\b', 'scopy'),
    (r'\bserv\b', 'service'),
    (r'\bspln\b', 'spleen'),
    (r'\bstrctj\b', 'stricture'),
    (r'\bsynovcmy\b', 'synovectomy'),
    (r'\btntmy\b', 'tenotomy'),
    (r'\btonsillect\b', 'tonsillectomy'),
    (r'\btrachstmy\b', 'tracheostomy'),
    (r'\btrnsfj\b', 'transfusion'),
    (r'\bunrltd\b', 'unrelated'),
    (r'\bvlvlplsty\b', 'valvuloplasty'),
    (r'\bvsc\b', 'vascular'),

    # ── Additional common CMS abbreviations (round 2) ──
    (r'\bart\b', 'arterial'),
    (r'\bassmt\b', 'assessment'),
    (r'\bassmt\b', 'assessment'),
    (r'\bbyp\b', 'bypass'),
    (r'\bchrnc\b', 'chronic'),
    (r'\bcmpl\b', 'complete'),
    (r'\bcmplt\b', 'complete'),
    (r'\bcplx\b', 'complex'),
    (r'\bcsn\b', 'cesarean'),
    (r'\bdisc\b', 'disc'),
    (r'\bdschrg\b', 'discharge'),
    (r'\belectrd\b', 'electrode'),
    (r'\bextrml\b', 'extremal'),
    (r'\bfemrl\b', 'femoral'),
    (r'\bfngr\b', 'finger'),
    (r'\bgastrc\b', 'gastric'),
    (r'\bgrft\b', 'graft'),
    (r'\bhrtlng\b', 'heart-lung'),
    (r'\bimpj\b', 'implantation'),
    (r'\bincisj\b', 'incision'),
    (r'\binfxn\b', 'infection'),
    (r'\bipslat\b', 'ipsilateral'),
    (r'\blacrm\b', 'lacrimal'),
    (r'\bmjr\b', 'major'),
    (r'\bmnr\b', 'minor'),
    (r'\bmlt\b', 'multiple'),
    (r'\bmucosal\b', 'mucosal'),
    (r'\bneg\b', 'negative'),
    (r'\bnphrlthsy\b', 'nephrolithotomy'),
    (r'\bnphrctmy\b', 'nephrectomy'),
    (r'\bpacemaker\b', 'pacemaker'),
    (r'\bphrngx\b', 'pharynx'),
    (r'\bpln\b', 'plan'),
    (r'\bplstc\b', 'plastic'),
    (r'\bpnctrj\b', 'puncture'),
    (r'\bpnumthr\b', 'pneumothorax'),
    (r'\bprs\b', 'pressure'),
    (r'\bprstlt\b', 'peristaltic'),
    (r'\bpt\b', 'patient'),
    (r'\bradj\b', 'radiation'),
    (r'\breducj\b', 'reduction'),
    (r'\brmvl\b', 'removal'),
    (r'\bspcmn\b', 'specimen'),
    (r'\bsqcm\b', 'sq cm'),
    (r'\bsurf\b', 'surface'),
    (r'\btndns\b', 'tendons'),
    (r'\btphrss\b', 'thyroplasty'),
    (r'\bvag\b', 'vaginal'),
    (r'\bvesl\b', 'vessel'),
    (r'\bvisc\b', 'visceral'),
    (r'\bxtrn\b', 'external'),
    (r'\bimp\b', 'impairment'),
    (r'\binclj\b', 'inclusion'),
    (r'\bmult\b', 'multiple'),
    (r'\bprmry\b', 'primary'),
    (r'\bscndry\b', 'secondary'),
    (r'\bsubsq\b', 'subsequent'),
    (r'\btrtmt\b', 'treatment'),

    # ── Final catch-alls ──
    (r'\bdye\b', 'contrast'),
    (r'\bnew\b', 'new patient'),
    (r'\b1st\b', 'initial'),
    (r'\boff\b', 'office'),
    (r'\beg\b', 'e.g.'),
    (r'\bcarp\b', 'carpal'),
    (r'\btarsl\b', 'tarsal'),
]

# ── Title case helper ─────────────────────────────────────────────────────
SMALL_WORDS = {'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in',
               'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'with',
               'without', 'per', 'via', 'from', 'into', 'than', 'each', 'under'}

ALWAYS_UPPER = {'ct', 'mri', 'iv', 'im', 'ekg', 'ecg', 'emg', 'eeg', 'er',
                'dme', 'cpap', 'bipap', 'tens', 'dxa', 'dexa',
                'hcpcs', 'cpt', 'pet', 'spect', 'icd', 'us'}


def title_case(s):
    """Smart title case: capitalize important words, keep acronyms upper."""
    words = s.split()
    result = []
    for i, w in enumerate(words):
        wl = w.lower().strip('(),-/')
        if wl in ALWAYS_UPPER:
            result.append(w.upper())
        elif i == 0 or wl not in SMALL_WORDS:
            result.append(w.capitalize())
        else:
            result.append(w.lower())
    return ' '.join(result)


def clean_whitespace(s):
    """Collapse multiple spaces, strip."""
    return re.sub(r'\s{2,}', ' ', s).strip()


# ── Category-specific formatting ──────────────────────────────────────────

def apply_category_rules(name, code, category, original_desc):
    """Apply category-specific formatting rules."""
    code_num = code if code.isdigit() else ''
    cnum = int(code_num) if code_num else 0

    # Drugs: already have good names, just clean up
    if 'Drug' in (category or ''):
        return original_desc

    # DME: often just product codes
    if category and 'DME' in category:
        lower = original_desc.lower()
        if 'dmepos item' in lower:
            return f"Durable Medical Equipment Item ({code})"

    # E&M codes (99xxx): clarify visit types
    if 99000 <= cnum <= 99499 or category == 'Evaluation & Management':
        name = name.replace('Office Outpatient', 'Office Visit -')
        name = name.replace('office outpatient', 'Office Visit -')

    # Physical Therapy (97xxx)
    if 97000 <= cnum <= 97799 or 'Physical' in (category or ''):
        lower = name.lower()
        if not lower.startswith('physical therapy'):
            if any(kw in lower for kw in ['therapy', 'therapeutic', 'exercise', 'traction',
                                           'stimulation', 'reeducation', 'whirlpool',
                                           'infrared', 'ultraviolet', 'diathermy',
                                           'paraffin', 'vasopneumatic']):
                name = 'Physical Therapy - ' + name

    return name


# ── Main name generation ─────────────────────────────────────────────────

def generate_consumer_name(code, description, category):
    """Generate a consumer-friendly name from a CMS abbreviated description."""
    if not description:
        return None

    original = description

    # For drugs, the descriptions are already readable
    if 'Drug' in (category or ''):
        return title_case(description)

    # For HCPCS DME codes with generic descriptions
    if category and 'DME' in category:
        lower = description.lower()
        if 'dmepos item' in lower:
            return f"Durable Medical Equipment Item ({code})"

    name = description

    # Apply abbreviation expansions
    for pattern, replacement in ABBREV_MAP:
        name = re.sub(pattern, replacement, name, flags=re.IGNORECASE)

    # Clean up double spaces
    name = clean_whitespace(name)

    # Apply category rules
    name = apply_category_rules(name, code, category, original)

    # Title case
    name = title_case(name)

    # Fix acronyms that title_case might have missed
    name = re.sub(r'\bX-ray\b', 'X-Ray', name, flags=re.IGNORECASE)
    name = name.replace('Mri', 'MRI').replace('mri', 'MRI')
    name = name.replace(' Ct ', ' CT ').replace('Ct Scan', 'CT Scan')
    name = re.sub(r'\bPet\b', 'PET', name)
    name = re.sub(r'\bIv\b', 'IV', name)
    name = re.sub(r'\bEkg\b', 'EKG', name)
    name = re.sub(r'\bEcg\b', 'ECG', name)
    name = re.sub(r'\bEmg\b', 'EMG', name)
    name = re.sub(r'\bEeg\b', 'EEG', name)
    name = re.sub(r'\bDme\b', 'DME', name)
    name = re.sub(r'\bDmepos\b', 'DMEPOS', name)

    name = clean_whitespace(name)

    if len(name) < 3:
        name = title_case(original)

    return name


# ── Fetch all procedures ──────────────────────────────────────────────────

def fetch_all_procedures():
    """Fetch all procedures from the API with pagination."""
    all_procs = []
    offset = 0
    total = None

    print("Fetching procedures from API...")
    while True:
        url = f"{API_BASE}?limit={PAGE_SIZE}&offset={offset}"
        try:
            req = Request(url, headers={"User-Agent": "consumer-name-gen/1.0"})
            with urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode())
        except Exception as e:
            print(f"  Error fetching offset {offset}: {e}")
            time.sleep(2)
            try:
                with urlopen(req, timeout=30) as resp:
                    data = json.loads(resp.read().decode())
            except Exception as e2:
                print(f"  Retry failed at offset {offset}: {e2}, skipping")
                offset += PAGE_SIZE
                continue

        if not data.get('success') or not data.get('data'):
            break

        batch = data['data']
        all_procs.extend(batch)

        if total is None:
            total = data.get('pagination', {}).get('total', '?')
            print(f"  Total procedures: {total}")

        offset += PAGE_SIZE
        if offset % 2000 == 0:
            print(f"  Fetched {len(all_procs)} so far...")

        if len(batch) < PAGE_SIZE:
            break

    print(f"  Done: fetched {len(all_procs)} procedures total")
    return all_procs


# ── SQL generation ────────────────────────────────────────────────────────

def escape_sql(s):
    return s.replace("'", "''")


def write_chunks(records):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for f in OUTPUT_DIR.glob("chunk-*.sql"):
        f.unlink()

    num_chunks = math.ceil(len(records) / CHUNK_SIZE)
    chunk_files = []

    for i in range(num_chunks):
        chunk = records[i * CHUNK_SIZE : (i + 1) * CHUNK_SIZE]
        filename = OUTPUT_DIR / f"chunk-{i:04d}.sql"
        lines = []
        for code, name in chunk:
            lines.append(
                f"INSERT OR REPLACE INTO consumer_descriptions (code, consumer_name) "
                f"VALUES ('{escape_sql(code)}', '{escape_sql(name)}');"
            )
        filename.write_text('\n'.join(lines) + '\n', encoding='utf-8')
        chunk_files.append(filename)

    print(f"  Wrote {len(chunk_files)} chunk files to {OUTPUT_DIR}")
    return chunk_files


# ── Load via wrangler ─────────────────────────────────────────────────────

def load_chunks(chunk_files):
    print(f"\nLoading {len(chunk_files)} chunks into D1...")
    success = 0
    failed = 0

    for i, f in enumerate(chunk_files):
        cmd = [
            "npx", "wrangler", "d1", "execute", DB_NAME,
            "--remote", f"--file={f}"
        ]
        try:
            result = subprocess.run(
                cmd,
                capture_output=True, text=True, timeout=120,
                cwd="/mnt/c/repos/medical-costs-api"
            )
            if result.returncode == 0:
                success += 1
            else:
                print(f"  WARN chunk {i}: {result.stderr[:200]}")
                failed += 1
        except subprocess.TimeoutExpired:
            print(f"  TIMEOUT chunk {i}")
            failed += 1
        except Exception as e:
            print(f"  ERROR chunk {i}: {e}")
            failed += 1

        if (i + 1) % 10 == 0:
            print(f"  Loaded {i + 1}/{len(chunk_files)} chunks ({success} ok, {failed} failed)")

    print(f"\nDone: {success} succeeded, {failed} failed out of {len(chunk_files)} chunks")
    return success, failed


# ── Main ──────────────────────────────────────────────────────────────────

EXISTING_CODES = {
    "10060","10061","11042","11102","11104","11106","12001","12002","12051",
    "20550","20552","20600","20605","20610","20670","20680","22551","22612",
    "22630","22632","22633","23430","23472","24505","25515","25600","27096",
    "27130","27236","27244","27245","27446","27447","27570","27702","27750",
    "28296","29823","29824","29826","29827","29880","29881","29882","29888",
    "29914","29916","36415","43239","45378","45380","45385","59012","59025",
    "59400","59409","59510","59514","62320","62322","62323","63030","63047",
    "64450","64483","64635","64636","64721","70450","70460","70540","70551",
    "70552","70553","71045","71046","71250","71260","72040","72070","72082",
    "72100","72125","72131","72141","72146","72148","72197","73030","73060",
    "73090","73130","73220","73221","73501","73502","73552","73562","73565",
    "73610","73620","73718","73721","73723","74018","74176","74177","76536",
    "76700","76801","76805","76815","76817","76830","76856","76881","76942",
    "77066","77067","77080","78452","78816","80048","80053","80061","81001",
    "83036","84443","85025","87070","87086","90471","90715","90791","90792",
    "90832","90834","90837","90839","90846","90847","90853","93000","93010",
    "93015","93017","93228","93288","93306","93350","93452","93458","93971",
    "96127","96365","96372","96374","97010","97012","97016","97032","97035",
    "97110","97112","97140","97150","97161","97162","97163","97530","97535",
    "97542","97760","99152","99153","99201","99202","99203","99204","99205",
    "99211","99212","99213","99214","99215","99281","99282","99283","99284",
    "99285","99291","99292","99385","99386","99387","99395","99396","99397",
    "G0008","G0009"
}


def main():
    procedures = fetch_all_procedures()

    print(f"\nSkipping {len(EXISTING_CODES)} procedures with hand-crafted descriptions")

    print(f"\nGenerating consumer names for {len(procedures)} procedures...")
    records = []
    skipped_existing = 0
    generated = 0

    for proc in procedures:
        code = proc.get('code', '')
        desc = proc.get('description', '')
        category = proc.get('category', '')

        if code in EXISTING_CODES:
            skipped_existing += 1
            continue

        name = generate_consumer_name(code, desc, category)
        if not name:
            continue

        records.append((code, name))
        generated += 1

    print(f"  Generated: {generated}")
    print(f"  Skipped (existing): {skipped_existing}")

    # Show samples by category
    print("\n── Sample generated names by category ──")
    import random

    # Group by category for sampling
    by_cat = {}
    for proc in procedures:
        code = proc['code']
        cat = proc.get('category', 'Unknown')
        for c, n in records:
            if c == code:
                by_cat.setdefault(cat, []).append((code, proc['description'], n))
                break

    for cat in ['Surgery - Musculoskeletal', 'Radiology', 'Evaluation & Management',
                'Physical Therapy/Rehab', 'Pathology/Laboratory', 'HCPCS - DME',
                'Surgery - Cardiovascular', 'Prescription Drug - Brand']:
        items = by_cat.get(cat, [])
        if items:
            print(f"\n  {cat}:")
            for code, orig, name in random.sample(items, min(3, len(items))):
                print(f"    {code}: {orig}")
                print(f"         -> {name}")

    # Write chunks
    print("\n\nWriting SQL chunks...")
    chunk_files = write_chunks(records)

    if DRY_RUN:
        print(f"\n[DRY RUN] Would load {len(chunk_files)} chunks into D1.")
        print(f"Files at: {OUTPUT_DIR}")
    else:
        load_chunks(chunk_files)

    print(f"\nTotal consumer_description records: {len(records)}")


if __name__ == "__main__":
    main()
