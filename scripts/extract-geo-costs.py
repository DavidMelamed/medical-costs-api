#!/usr/bin/env python3
"""
Extract geographic cost data from CMS PFALL26AR.txt for top 200 injury-relevant procedures.
Generates chunked SQL files for loading into D1 via wrangler.
"""
import csv
import os
import hashlib

BASE_DIR = "/mnt/c/repos/medical-costs-api"
PAYMENT_FILE = os.path.join(BASE_DIR, "data/cms/pfrev26a/PFREV26A /PFALL26AR.txt")
LOCALITY_FILE = os.path.join(BASE_DIR, "data/cms/localities2026.csv")
OUTPUT_DIR = os.path.join(BASE_DIR, "data/cms/geo-chunks")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Top 200 injury-relevant procedure codes (already in DB as proc_{code})
TARGET_CODES = {
    # E/M Office visits
    '99202','99203','99204','99205','99211','99212','99213','99214','99215',
    # Hospital
    '99221','99222','99223','99231','99232','99233','99234','99235','99236','99238','99239',
    # Emergency
    '99281','99282','99283','99284','99285',
    # Critical Care
    '99291','99292',
    # Home/SNF visits
    '99341','99342','99344','99345','99347','99348','99349','99350',
    # Radiology - Head/Spine
    '70450','70460','70486','70551','70553',
    # Radiology - Chest/Abdomen
    '71045','71046','71260','74018','74150','74160','74170','74176','74177','74178',
    # Radiology - Spine
    '72040','72050','72070','72100','72110','72131','72141','72146','72148','72156','72157','72158',
    # Radiology - Upper extremity
    '73000','73030','73060','73070','73080','73090','73100','73110','73120','73130','73140','73221',
    # Radiology - Lower extremity
    '73560','73562','73564','73590','73600','73610','73620','73630','73650','73660','73718','73720','73721',
    # Ultrasound
    '76536','76700','76770','76856','76881','76882',
    # Bone density/studies
    '77073','77074','77076','77077',
    # Cardiology
    '93000','93005','93010','93015','93306','93307','93308','93312','93320','93325',
    # Neurology/EMG
    '95819','95907','95908','95909','95910','95911',
    # Physical Therapy
    '97035','97110','97112','97113','97116','97129','97130','97140','97150',
    '97161','97162','97163','97164','97530','97535','97542','97760',
    # Chiropractic
    '98940','98941','98942',
    # Phone E/M
    '98966','98967','98968',
    # Psychiatry/Neuropsych
    '90791','90792','90832','90834','90837','90847','90853',
    '96116','96121','96132','96133','96136','96137',
    # Injections
    '20552','20553','20610','20611','62322','62323','64483','64490','64491','64493','64494','64495',
    # Surgery - Spine
    '22551','22554','22558','22600','22612','22630','22633',
    '63001','63005','63017','63030','63042','63045','63047','63048','63056',
    # Surgery - Shoulder
    '23120','23130','23430','23440','23472','29806','29807','29823','29826','29827',
    # Surgery - Knee
    '27427','27428','27429','27447','29880','29881',
    # Surgery - Hip
    '27130','27132','27134','27236','27244','27245','27269',
    # Surgery - Fractures
    '25605','25607','25608','25609','25628',
    '27506','27507','27511','27513','27514','27524','27535','27536','27540','27566','27769',
    # Lab
    '36415',
    # 25611 not in list above, add a few more high-value ones
    '25611',
}

print(f"Target codes: {len(TARGET_CODES)}")

# ============================================================================
# Parse locality file to build MAC+Loc -> state_code, locality_name, GPCIs
# ============================================================================
locality_map = {}  # (mac5, loc2) -> {state_code, loc_description, gpci_work, gpci_pe, gpci_mp}

# State mapping from MAC descriptions and locality names
MAC_STATE_MAP = {
    'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
    'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE',
    'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI', 'IDAHO': 'ID',
    'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA', 'KANSAS': 'KS',
    'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
    'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS',
    'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV',
    'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM', 'NEW YORK': 'NY',
    'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH', 'OKLAHOMA': 'OK',
    'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
    'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT',
    'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV',
    'WISCONSIN': 'WI', 'WYOMING': 'WY', 'PUERTO RICO': 'PR', 'VIRGIN ISLANDS': 'VI',
    'DC': 'DC', 'GUAM': 'GU',
}

# Location-specific state overrides
LOC_STATE = {
    'MANHATTAN': 'NY', 'NYC SUBURBS/LONG ISLAND': 'NY', 'POUGHKPSIE/N NYC SUBURBS': 'NY',
    'REST OF NEW YORK': 'NY', 'QUEENS': 'NY',
    'SAN FRANCISCO-OAKLAND-BERKELEY': 'CA', 'SAN JOSE-SUNNYVALE-SANTA CLARA': 'CA',
    'LOS ANGELES-LONG BEACH-ANAHEIM': 'CA', 'SAN DIEGO-CHULA VISTA-CARLSBAD': 'CA',
    'SACRAMENTO-ROSEVILLE-FOLSOM': 'CA', 'REST OF CALIFORNIA': 'CA',
    'OXNARD-THOUSAND OAKS-VENTURA': 'CA', 'RIVERSIDE-SAN BERNARDINO-ONTARIO': 'CA',
    'BAKERSFIELD': 'CA', 'CHICO': 'CA', 'FRESNO': 'CA', 'NAPA': 'CA',
    'MODESTO': 'CA', 'REDDING': 'CA', 'SALINAS': 'CA', 'STOCKTON': 'CA',
    'VISALIA': 'CA', 'VALLEJO': 'CA', 'MERCED': 'CA', 'MADERA': 'CA',
    'EL CENTRO': 'CA', 'HANFORD-CORCORAN': 'CA', 'SANTA CRUZ-WATSONVILLE': 'CA',
    'SANTA ROSA-PETALUMA': 'CA', 'SAN LUIS OBISPO-PASO ROBLES': 'CA',
    'SANTA MARIA-SANTA BARBARA': 'CA', 'YUBA CITY': 'CA',
    'CHICAGO': 'IL', 'SUBURBAN CHICAGO': 'IL', 'EAST ST. LOUIS': 'IL', 'REST OF ILLINOIS': 'IL',
    'DETROIT': 'MI', 'REST OF MICHIGAN': 'MI',
    'FORT LAUDERDALE': 'FL', 'MIAMI': 'FL', 'REST OF FLORIDA': 'FL',
    'DALLAS': 'TX', 'HOUSTON': 'TX', 'BRAZORIA': 'TX', 'GALVESTON': 'TX',
    'BEAUMONT': 'TX', 'FORT WORTH': 'TX', 'AUSTIN': 'TX', 'REST OF TEXAS': 'TX',
    'ATLANTA': 'GA', 'REST OF GEORGIA': 'GA',
    'PORTLAND': 'OR', 'REST OF OREGON': 'OR',
    'SEATTLE': 'WA', 'REST OF WASHINGTON': 'WA',
    'NEW ORLEANS': 'LA', 'REST OF LOUISIANA': 'LA',
    'METROPOLITAN ST. LOUIS': 'MO', 'METROPOLITAN KANSAS CITY': 'MO', 'REST OF MISSOURI': 'MO',
    'NORTHERN NJ': 'NJ', 'REST OF NEW JERSEY': 'NJ',
    'METROPOLITAN PHILADELPHIA': 'PA', 'REST OF PENNSYLVANIA': 'PA',
    'DC + MD/VA SUBURBS': 'DC',
    'BALTIMORE/SURR. CNTYS': 'MD', 'REST OF MARYLAND': 'MD',
    'METROPOLITAN BOSTON': 'MA', 'REST OF MASSACHUSETTS': 'MA',
    'SOUTHERN MAINE': 'ME', 'REST OF MAINE': 'ME',
}

def get_state_code(loc_desc, mac_desc):
    """Determine state code from locality description or MAC description."""
    # Clean up
    desc = loc_desc.strip().replace('*', '').split('EDS01')[0].strip()

    # Direct match
    for key, state in LOC_STATE.items():
        if key in desc.upper():
            return state

    # State name match
    for state_name, code in MAC_STATE_MAP.items():
        if state_name in desc.upper():
            return code

    # Try MAC description
    for state_name, code in MAC_STATE_MAP.items():
        if state_name in mac_desc.upper():
            return code

    # MAC-based fallback
    mac_to_state = {
        'NORTHERN CALIFORNIA': 'CA', 'SOUTHERN CALIFORNIA': 'CA',
        'HAWAII/GUAM': 'HI', 'NEVADA': 'NV', 'ALASKA': 'AK', 'IDAHO': 'ID',
        'OREGON': 'OR', 'WASHINGTON': 'WA', 'ARIZONA': 'AZ', 'MONTANA': 'MT',
        'NORTH DAKOTA': 'ND', 'SOUTH DAKOTA': 'SD', 'UTAH': 'UT', 'WYOMING': 'WY',
        'COLORADO': 'CO', 'NEW MEXICO': 'NM', 'OKLAHOMA': 'OK', 'TEXAS': 'TX',
        'IOWA': 'IA', 'KANSAS': 'KS', 'MISSOURI': 'MO', 'NEBRASKA': 'NE',
        'ILLINOIS': 'IL', 'MINNESOTA': 'MN', 'WISCONSIN': 'WI',
        'ARKANSAS': 'AR', 'LOUISIANA': 'LA', 'MISSISSIPPI': 'MS',
        'INDIANA': 'IN', 'MICHIGAN': 'MI', 'FLORIDA': 'FL',
        'PUERTO RICO/VIRGIN ISLANDS': 'PR', 'ALABAMA': 'AL', 'GEORGIA': 'GA',
        'TENNESSEE': 'TN', 'SOUTH CAROLINA': 'SC', 'VIRGINIA': 'VA',
        'NORTH CAROLINA': 'NC', 'WEST VIRGINIA': 'WV',
        'DELAWARE': 'DE', 'DISTRICT OF COLUMBIA': 'DC', 'MARYLAND': 'MD',
        'NEW JERSEY': 'NJ', 'PENNSYLVANIA': 'PA', 'CONNECTICUT': 'CT',
        'EMPIRE NEW YORK': 'NY', 'WESTERN NEW YORK': 'NY', 'GHI/NEW YORK': 'NY',
        'MAINE': 'ME', 'MASSACHUSETTS': 'MA', 'NEW HAMPSHIRE': 'NH',
        'RHODE ISLAND': 'RI', 'VERMONT': 'VT', 'KENTUCKY': 'KY', 'OHIO': 'OH',
    }
    for key, state in mac_to_state.items():
        if key in mac_desc.upper():
            return state

    return None

# Read localities file
with open(LOCALITY_FILE, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        loc_code = row['locality']  # e.g. "0111205"
        if len(loc_code) < 7:
            continue
        mac5 = loc_code[:5]
        loc2 = loc_code[5:]

        loc_desc = row['loc_description'].strip().replace('*','').split('EDS01')[0].strip()
        mac_desc = row.get('mac_description', '')
        state = get_state_code(loc_desc, mac_desc)

        if state:
            locality_map[(mac5, loc2)] = {
                'state_code': state,
                'locality': loc_desc,
                'mac_number': mac5,
                'gpci_work': float(row['gpci_work']),
                'gpci_pe': float(row['gpci_pe']),
                'gpci_mp': float(row['gpci_mp']),
            }

print(f"Loaded {len(locality_map)} locality mappings")

# Show unmapped
unmapped_combos = set()

# ============================================================================
# Parse payment file - extract rows for target codes with no modifier
# ============================================================================
geo_records = []  # list of dicts

print("Scanning payment file...")
line_count = 0
matched = 0
skipped_modifier = 0
skipped_zero = 0

with open(PAYMENT_FILE, 'r') as f:
    for line in f:
        line_count += 1
        if line_count % 200000 == 0:
            print(f"  ...processed {line_count} lines, {matched} matches")

        parts = [p.strip().strip('"') for p in line.strip().split(',')]
        if len(parts) < 7:
            continue

        year = parts[0]
        mac5 = parts[1]
        loc2 = parts[2]
        hcpcs = parts[3]
        modifier = parts[4].strip()
        non_fac_price = parts[5]
        fac_price = parts[6]

        # Only target codes
        if hcpcs not in TARGET_CODES:
            continue

        # Skip modified versions (we want base prices)
        if modifier and modifier.strip():
            skipped_modifier += 1
            continue

        # Parse prices
        try:
            nfp = float(non_fac_price)
            fp = float(fac_price)
        except:
            continue

        # Skip zero-price rows
        if nfp == 0 and fp == 0:
            skipped_zero += 1
            continue

        # Look up locality
        loc_info = locality_map.get((mac5, loc2))
        if not loc_info:
            unmapped_combos.add((mac5, loc2))
            continue

        proc_id = f"proc_{hcpcs}"

        # Generate deterministic ID
        id_str = f"{proc_id}_{loc_info['state_code']}_{loc_info['locality']}_{year}"
        geo_id = hashlib.md5(id_str.encode()).hexdigest()[:24]

        # Commercial estimates
        commercial_low = nfp * 1.3
        commercial_high = nfp * 2.0
        workers_comp = nfp * 1.4

        geo_records.append({
            'id': geo_id,
            'procedure_id': proc_id,
            'state_code': loc_info['state_code'],
            'locality': loc_info['locality'],
            'mac_number': mac5,
            'work_gpci': loc_info['gpci_work'],
            'pe_gpci': loc_info['gpci_pe'],
            'malpractice_gpci': loc_info['gpci_mp'],
            'facility_rate': fp,
            'non_facility_rate': nfp,
            'commercial_multiplier': 1.5,
            'estimated_commercial_low': round(commercial_low, 2),
            'estimated_commercial_high': round(commercial_high, 2),
            'workers_comp_rate': round(workers_comp, 2),
            'effective_year': int(year),
        })
        matched += 1

print(f"\nDone scanning. Lines: {line_count}, Matches: {matched}")
print(f"Skipped modifiers: {skipped_modifier}, Zero-price: {skipped_zero}")
print(f"Unmapped MAC+Loc combos: {len(unmapped_combos)}")
for combo in sorted(unmapped_combos)[:10]:
    print(f"  {combo}")

# ============================================================================
# Generate SQL chunks
# ============================================================================
def escape_sql(s):
    return str(s).replace("'", "''")

def make_insert(rec):
    return (
        f"INSERT OR REPLACE INTO medical_cost_geographic "
        f"(id, procedure_id, state_code, locality, mac_number, "
        f"work_gpci, pe_gpci, malpractice_gpci, "
        f"facility_rate, non_facility_rate, "
        f"commercial_multiplier, estimated_commercial_low, estimated_commercial_high, "
        f"workers_comp_rate, effective_year) VALUES ("
        f"'{escape_sql(rec['id'])}', '{escape_sql(rec['procedure_id'])}', "
        f"'{escape_sql(rec['state_code'])}', '{escape_sql(rec['locality'])}', "
        f"'{escape_sql(rec['mac_number'])}', "
        f"{rec['work_gpci']}, {rec['pe_gpci']}, {rec['malpractice_gpci']}, "
        f"{rec['facility_rate']}, {rec['non_facility_rate']}, "
        f"{rec['commercial_multiplier']}, {rec['estimated_commercial_low']}, "
        f"{rec['estimated_commercial_high']}, {rec['workers_comp_rate']}, "
        f"{rec['effective_year']});"
    )

CHUNK_SIZE = 400  # rows per file (well under 500 line limit with header)
chunks = []
current_chunk = []

for rec in geo_records:
    current_chunk.append(make_insert(rec))
    if len(current_chunk) >= CHUNK_SIZE:
        chunks.append(current_chunk)
        current_chunk = []

if current_chunk:
    chunks.append(current_chunk)

print(f"\nGenerating {len(chunks)} SQL chunk files...")

for i, chunk in enumerate(chunks):
    filename = f"geo-chunk-{i:04d}.sql"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w') as f:
        f.write(f"-- Geographic cost data chunk {i+1}/{len(chunks)}\n")
        f.write(f"-- Records: {len(chunk)}\n\n")
        for stmt in chunk:
            f.write(stmt + "\n")

print(f"Generated {len(chunks)} files in {OUTPUT_DIR}")
print(f"Total geographic records to load: {len(geo_records)}")

# Summary by state
state_counts = {}
for rec in geo_records:
    st = rec['state_code']
    state_counts[st] = state_counts.get(st, 0) + 1
print(f"\nRecords by state ({len(state_counts)} states):")
for st in sorted(state_counts, key=lambda x: state_counts[x], reverse=True)[:15]:
    print(f"  {st}: {state_counts[st]}")

# Summary by procedure type
code_counts = {}
for rec in geo_records:
    code = rec['procedure_id'].replace('proc_', '')
    code_counts[code] = code_counts.get(code, 0) + 1
print(f"\nCodes with geographic data: {len(code_counts)}")
