#!/usr/bin/env npx tsx
/**
 * Harvest "People Also Ask" questions from DataForSEO SERP API
 *
 * Queries Google for "how much does {procedure} cost" and extracts PAA items.
 * Loads results into D1 `people_also_ask` table via Cloudflare API.
 *
 * Usage:
 *   npx tsx scripts/harvest-paa.ts                    # Run batch 1 (first 500)
 *   npx tsx scripts/harvest-paa.ts --batch 2          # Run batch 2 (501-1000)
 *   npx tsx scripts/harvest-paa.ts --test             # Test with 3 queries
 *   npx tsx scripts/harvest-paa.ts --dry-run          # Preview queries without calling API
 *   npx tsx scripts/harvest-paa.ts --from-db          # Build queries from consumer_descriptions table
 *   npx tsx scripts/harvest-paa.ts --from-db --batch 2
 *
 * Budget: ~$0.002 per query. 500 queries = $1.00
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DATAFORSEO_LOGIN = "david@davidmelamed.com";
const DATAFORSEO_PASSWORD = "00208c1be8be582f";
const DATAFORSEO_API = "https://api.dataforseo.com/v3/serp/google/organic/live/advanced";

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || ""; // Set if using REST API
const D1_DATABASE_ID = "f3c4c390-86ac-4ffc-a887-0198c35abdc2";
const CF_API_TOKEN = process.env.CF_API_TOKEN || ""; // For D1 REST API

// We'll use wrangler d1 execute for loading data instead of REST API
const USE_WRANGLER = true;

const BATCH_SIZE = 3; // DataForSEO allows up to 100 tasks per request, but we do 3 for rate safety
const DELAY_BETWEEN_BATCHES_MS = 1500;
const QUERIES_PER_BATCH = 500;

// ---------------------------------------------------------------------------
// Curated procedure list — top 500 consumer-searched medical procedures
// Organized by clinical importance and search volume
// ---------------------------------------------------------------------------

interface ProcedureQuery {
  code: string;        // CPT/HCPCS code (for linking to our data)
  consumerName: string; // What patients call it
  query: string;       // The Google search query
}

function buildCuratedQueries(): ProcedureQuery[] {
  const queries: ProcedureQuery[] = [];

  function add(code: string, consumerName: string, queryOverride?: string) {
    const query = queryOverride || `how much does ${consumerName.toLowerCase()} cost`;
    queries.push({ code, consumerName, query });
  }

  // =========================================================================
  // EMERGENCY / E&M VISITS (99201-99285) — Highest search volume
  // =========================================================================
  add("99281", "Emergency Room Visit - Minor", "how much does an ER visit cost");
  add("99282", "Emergency Room Visit - Low Complexity", "how much does an emergency room visit cost without insurance");
  add("99283", "Emergency Room Visit - Moderate", "average emergency room visit cost");
  add("99284", "Emergency Room Visit - High Complexity", "how much does an ER visit cost with insurance");
  add("99285", "Emergency Room Visit - Critical", "how much does an emergency room visit cost for stitches");
  add("99281", "ER Visit for Broken Bone", "how much does an ER visit cost for a broken bone");
  add("99283", "ER Visit Chest Pain", "how much does an ER visit for chest pain cost");

  // Office visits
  add("99201", "New Patient Office Visit", "how much does a doctor visit cost without insurance");
  add("99202", "New Patient Office Visit", "new patient doctor visit cost");
  add("99203", "Office Visit - Low Complexity", "how much does a doctor office visit cost");
  add("99204", "Office Visit - Moderate Complexity", "how much does a specialist doctor visit cost");
  add("99205", "Office Visit - High Complexity", "how much does a specialist appointment cost without insurance");
  add("99211", "Follow-up Visit - Minimal", "how much does a follow up doctor visit cost");
  add("99212", "Follow-up Visit - Straightforward", "how much does a nurse visit cost");
  add("99213", "Follow-up Visit - Low Complexity", "how much does a routine doctor visit cost");
  add("99214", "Follow-up Visit - Moderate Complexity", "how much does a doctor visit cost");
  add("99215", "Follow-up Visit - High Complexity", "how much does an extended doctor visit cost");

  // Urgent Care
  add("99201", "Urgent Care Visit", "how much does an urgent care visit cost");
  add("99201", "Urgent Care Visit No Insurance", "how much does urgent care cost without insurance");
  add("99213", "Walk-in Clinic Visit", "how much does a walk-in clinic visit cost");
  add("99213", "Telehealth Visit", "how much does a telehealth visit cost");

  // =========================================================================
  // IMAGING — MRI (very high search volume)
  // =========================================================================
  add("70553", "MRI Brain with Contrast", "how much does a brain MRI cost");
  add("70551", "MRI Brain without Contrast", "how much does an MRI of the brain cost without insurance");
  add("72148", "MRI Lower Back", "how much does a lower back MRI cost");
  add("72141", "MRI Cervical Spine", "how much does a neck MRI cost");
  add("72146", "MRI Thoracic Spine", "how much does a thoracic spine MRI cost");
  add("73721", "MRI Knee", "how much does a knee MRI cost");
  add("73221", "MRI Shoulder", "how much does a shoulder MRI cost");
  add("73721", "MRI Knee No Insurance", "how much does an MRI cost without insurance");
  add("70553", "MRI", "how much does an MRI cost");
  add("70540", "MRI Face/Neck", "how much does an MRI of the neck cost");
  add("72148", "MRI Lumbar", "how much does a lumbar MRI cost");
  add("73718", "MRI Ankle", "how much does an ankle MRI cost");
  add("73221", "MRI Shoulder No Insurance", "MRI shoulder cost without insurance");
  add("73721", "MRI Knee with Insurance", "how much does a knee MRI cost with insurance");
  add("72197", "MRI Pelvis", "how much does a pelvic MRI cost");
  add("73218", "MRI Arm", "how much does an arm MRI cost");
  add("73718", "MRI Foot", "how much does a foot MRI cost");
  add("70553", "MRI with Contrast", "how much does an MRI with contrast cost");
  add("74183", "MRI Abdomen", "how much does an abdominal MRI cost");
  add("70336", "MRI TMJ", "how much does a TMJ MRI cost");
  add("73221", "MRI Rotator Cuff", "how much does an MRI for rotator cuff cost");
  add("71552", "MRI Chest", "how much does a chest MRI cost");
  add("70553", "MRI Open", "how much does an open MRI cost");
  add("73721", "MRI ACL", "how much does an MRI for a torn ACL cost");

  // =========================================================================
  // IMAGING — CT Scans
  // =========================================================================
  add("70450", "CT Head", "how much does a CT scan cost");
  add("70460", "CT Head with Contrast", "how much does a CT scan of the head cost");
  add("74177", "CT Abdomen/Pelvis with Contrast", "how much does a CT scan of the abdomen cost");
  add("74176", "CT Abdomen/Pelvis", "how much does an abdominal CT scan cost without insurance");
  add("72131", "CT Lumbar Spine", "how much does a CT scan of the spine cost");
  add("72125", "CT Cervical Spine", "how much does a CT scan of the neck cost");
  add("71260", "CT Chest with Contrast", "how much does a CT scan of the chest cost");
  add("71250", "CT Chest", "how much does a lung CT scan cost");
  add("70486", "CT Sinuses", "how much does a sinus CT scan cost");
  add("74178", "CT Abdomen Triple Phase", "how much does a CT scan cost without insurance");
  add("77014", "CT Guidance", "how much does a CT guided biopsy cost");
  add("70450", "CT Brain", "how much does a brain CT scan cost");

  // =========================================================================
  // IMAGING — X-rays
  // =========================================================================
  add("73030", "X-ray Shoulder", "how much does an X-ray cost");
  add("73030", "X-ray Shoulder", "how much does a shoulder X-ray cost");
  add("73560", "X-ray Knee", "how much does a knee X-ray cost");
  add("73610", "X-ray Ankle", "how much does an ankle X-ray cost");
  add("72100", "X-ray Spine", "how much does a back X-ray cost");
  add("71046", "X-ray Chest", "how much does a chest X-ray cost");
  add("73110", "X-ray Wrist", "how much does a wrist X-ray cost");
  add("73130", "X-ray Hand", "how much does a hand X-ray cost");
  add("73620", "X-ray Foot", "how much does a foot X-ray cost");
  add("70150", "X-ray Face", "how much does a dental X-ray cost");
  add("73060", "X-ray Humerus", "how much does an X-ray cost without insurance");
  add("77080", "DEXA Scan", "how much does a DEXA bone density scan cost");
  add("71046", "Chest X-ray for TB", "how much does a chest X-ray cost for immigration");

  // =========================================================================
  // IMAGING — Ultrasound
  // =========================================================================
  add("76856", "Pelvic Ultrasound", "how much does an ultrasound cost");
  add("76805", "OB Ultrasound", "how much does a pregnancy ultrasound cost");
  add("76830", "Transvaginal Ultrasound", "how much does a transvaginal ultrasound cost");
  add("76700", "Abdominal Ultrasound", "how much does an abdominal ultrasound cost");
  add("93306", "Echocardiogram", "how much does an echocardiogram cost");
  add("76536", "Thyroid Ultrasound", "how much does a thyroid ultrasound cost");
  add("76881", "Extremity Ultrasound", "how much does a musculoskeletal ultrasound cost");
  add("93880", "Carotid Ultrasound", "how much does a carotid ultrasound cost");
  add("76770", "Kidney Ultrasound", "how much does a kidney ultrasound cost");
  add("76641", "Breast Ultrasound", "how much does a breast ultrasound cost");
  add("76817", "3D/4D Ultrasound", "how much does a 3D ultrasound cost");
  add("93971", "Venous Ultrasound", "how much does a venous doppler ultrasound cost");

  // =========================================================================
  // MAJOR SURGERIES — Orthopedic
  // =========================================================================
  add("27447", "Total Knee Replacement", "how much does a knee replacement cost");
  add("27130", "Total Hip Replacement", "how much does a hip replacement cost");
  add("29881", "Knee Arthroscopy/Meniscectomy", "how much does knee arthroscopy cost");
  add("27428", "ACL Reconstruction", "how much does ACL surgery cost");
  add("23472", "Shoulder Replacement", "how much does shoulder replacement surgery cost");
  add("23412", "Rotator Cuff Repair", "how much does rotator cuff surgery cost");
  add("29827", "Rotator Cuff Arthroscopic", "how much does arthroscopic rotator cuff repair cost");
  add("22612", "Spinal Fusion Lumbar", "how much does spinal fusion surgery cost");
  add("22551", "Spinal Fusion Cervical", "how much does cervical fusion surgery cost");
  add("63030", "Lumbar Discectomy", "how much does a discectomy cost");
  add("63047", "Laminectomy", "how much does a laminectomy cost");
  add("27236", "Hip Fracture Repair", "how much does hip fracture surgery cost");
  add("25600", "Wrist Fracture Repair", "how much does broken wrist surgery cost");
  add("27244", "Hip Fracture Nail", "how much does a broken hip cost to treat");
  add("27759", "Tibial Fracture Repair", "how much does broken leg surgery cost");
  add("25607", "Distal Radius Fracture", "how much does a wrist fracture surgery cost");
  add("28296", "Bunion Surgery", "how much does bunion surgery cost");
  add("20680", "Hardware Removal", "how much does hardware removal surgery cost");
  add("24685", "Elbow Fracture Repair", "how much does elbow surgery cost");
  add("23616", "Shoulder Fracture Repair", "how much does shoulder surgery cost");
  add("29848", "Carpal Tunnel Release", "how much does carpal tunnel surgery cost");
  add("29881", "Meniscus Repair", "how much does meniscus surgery cost");
  add("27570", "Knee Manipulation Under Anesthesia", "how much does knee manipulation cost");
  add("20610", "Joint Injection", "how much does a cortisone shot cost");
  add("20611", "Joint Injection Major", "how much does a knee injection cost");
  add("27446", "Partial Knee Replacement", "how much does a partial knee replacement cost");
  add("27125", "Partial Hip Replacement", "how much does a partial hip replacement cost");

  // =========================================================================
  // MAJOR SURGERIES — General/GI
  // =========================================================================
  add("44970", "Laparoscopic Appendectomy", "how much does an appendectomy cost");
  add("47562", "Laparoscopic Cholecystectomy", "how much does gallbladder surgery cost");
  add("49505", "Inguinal Hernia Repair", "how much does hernia surgery cost");
  add("49650", "Laparoscopic Hernia Repair", "how much does laparoscopic hernia repair cost");
  add("43239", "Upper Endoscopy with Biopsy", "how much does an endoscopy cost");
  add("45380", "Colonoscopy with Biopsy", "how much does a colonoscopy cost");
  add("45378", "Colonoscopy Screening", "how much does a screening colonoscopy cost");
  add("45385", "Colonoscopy with Polyp Removal", "how much does a colonoscopy with polyp removal cost");
  add("43235", "Upper Endoscopy", "how much does an upper endoscopy cost");
  add("43644", "Gastric Bypass", "how much does gastric bypass surgery cost");
  add("43775", "Gastric Sleeve", "how much does gastric sleeve surgery cost");
  add("43770", "Lap Band Surgery", "how much does lap band surgery cost");
  add("43280", "Fundoplication", "how much does GERD surgery cost");
  add("44120", "Small Bowel Resection", "how much does bowel resection surgery cost");
  add("44140", "Colectomy Partial", "how much does colon surgery cost");
  add("46255", "Hemorrhoid Surgery", "how much does hemorrhoid surgery cost");
  add("46947", "Hemorrhoid Banding", "how much does hemorrhoid banding cost");

  // =========================================================================
  // CARDIOLOGY
  // =========================================================================
  add("93000", "EKG/ECG", "how much does an EKG cost");
  add("93000", "Electrocardiogram", "how much does an ECG cost");
  add("93015", "Stress Test", "how much does a cardiac stress test cost");
  add("93452", "Cardiac Catheterization", "how much does a cardiac catheterization cost");
  add("33533", "Coronary Bypass CABG", "how much does open heart surgery cost");
  add("33533", "CABG Surgery", "how much does coronary bypass surgery cost");
  add("92928", "Coronary Stent", "how much does a heart stent cost");
  add("33361", "TAVR", "how much does TAVR cost");
  add("33405", "Aortic Valve Replacement", "how much does heart valve replacement surgery cost");
  add("33208", "Pacemaker Insertion", "how much does a pacemaker cost");
  add("33249", "Defibrillator Insertion", "how much does a defibrillator implant cost");
  add("93303", "Transthoracic Echo", "how much does a heart ultrasound cost");
  add("93350", "Stress Echo", "how much does a stress echocardiogram cost");
  add("78452", "Nuclear Stress Test", "how much does a nuclear stress test cost");
  add("93228", "Holter Monitor", "how much does a Holter monitor cost");
  add("93241", "Event Monitor", "how much does a heart monitor cost");
  add("75571", "Cardiac CT Calcium Score", "how much does a calcium score test cost");

  // =========================================================================
  // WOMEN'S HEALTH / OB-GYN
  // =========================================================================
  add("59400", "Vaginal Delivery", "how much does it cost to have a baby");
  add("59510", "C-Section", "how much does a C-section cost");
  add("59400", "Childbirth", "how much does childbirth cost without insurance");
  add("59025", "Fetal Non-Stress Test", "how much does a non-stress test cost");
  add("76805", "Prenatal Ultrasound", "how much does a prenatal ultrasound cost");
  add("59000", "Amniocentesis", "how much does an amniocentesis cost");
  add("58661", "Laparoscopic Hysterectomy", "how much does a hysterectomy cost");
  add("58558", "Hysteroscopy with D&C", "how much does a D&C cost");
  add("58571", "Total Hysterectomy Laparoscopic", "how much does a laparoscopic hysterectomy cost");
  add("58100", "Endometrial Biopsy", "how much does an endometrial biopsy cost");
  add("58660", "Laparoscopic Tubal Ligation", "how much does getting your tubes tied cost");
  add("58340", "HSG Test", "how much does an HSG test cost");
  add("76811", "Detailed Anatomy Ultrasound", "how much does a 20 week ultrasound cost");
  add("88175", "Pap Smear", "how much does a Pap smear cost");
  add("77067", "Mammogram Screening", "how much does a mammogram cost");
  add("77066", "Mammogram Diagnostic", "how much does a diagnostic mammogram cost");
  add("19301", "Breast Lumpectomy", "how much does a lumpectomy cost");
  add("19303", "Mastectomy", "how much does a mastectomy cost");
  add("58262", "Vaginal Hysterectomy", "how much does a vaginal hysterectomy cost");

  // IVF / Fertility
  add("58970", "Egg Retrieval", "how much does IVF cost");
  add("89268", "ICSI", "how much does ICSI cost");
  add("58974", "Embryo Transfer", "how much does embryo transfer cost");
  add("58970", "Egg Freezing", "how much does egg freezing cost");
  add("89258", "Sperm Freezing", "how much does sperm freezing cost");
  add("58321", "IUI", "how much does IUI cost");

  // =========================================================================
  // DENTAL / ORAL SURGERY
  // =========================================================================
  add("41899", "Wisdom Teeth Removal", "how much does wisdom teeth removal cost");
  add("41899", "Tooth Extraction", "how much does a tooth extraction cost");
  add("21210", "Dental Implant", "how much does a dental implant cost");
  add("21085", "Dental Crown", "how much does a dental crown cost");
  add("41899", "Root Canal", "how much does a root canal cost");
  add("41899", "Dental Filling", "how much does a cavity filling cost");
  add("21085", "Dental Bridge", "how much does a dental bridge cost");
  add("41899", "Dental Cleaning", "how much does a dental cleaning cost without insurance");
  add("21199", "Jaw Surgery", "how much does jaw surgery cost");

  // =========================================================================
  // DERMATOLOGY / SKIN
  // =========================================================================
  add("11102", "Skin Biopsy", "how much does a skin biopsy cost");
  add("17000", "Skin Lesion Removal", "how much does mole removal cost");
  add("17110", "Wart Removal", "how much does wart removal cost");
  add("17311", "Mohs Surgery", "how much does Mohs surgery cost");
  add("15002", "Skin Graft", "how much does a skin graft cost");
  add("11042", "Wound Debridement", "how much does wound debridement cost");
  add("17360", "Chemical Peel", "how much does a chemical peel cost");
  add("17999", "Laser Skin Treatment", "how much does laser skin treatment cost");
  add("15830", "Abdominoplasty", "how much does a tummy tuck cost");
  add("15877", "Liposuction", "how much does liposuction cost");
  add("15820", "Blepharoplasty", "how much does eyelid surgery cost");
  add("15780", "Dermabrasion", "how much does dermabrasion cost");
  add("17340", "Cryotherapy", "how much does cryotherapy cost");

  // =========================================================================
  // EYE / OPHTHALMOLOGY
  // =========================================================================
  add("66984", "Cataract Surgery", "how much does cataract surgery cost");
  add("65855", "LASIK", "how much does LASIK cost");
  add("92004", "Comprehensive Eye Exam", "how much does an eye exam cost");
  add("65820", "Glaucoma Surgery", "how much does glaucoma surgery cost");
  add("67028", "Eye Injection", "how much does an eye injection cost");
  add("67113", "Retinal Detachment Repair", "how much does retinal detachment surgery cost");
  add("67210", "Laser Eye Treatment", "how much does laser eye surgery cost");
  add("66170", "Trabeculectomy", "how much does trabeculectomy cost");
  add("67108", "Vitrectomy", "how much does vitrectomy cost");
  add("92134", "OCT Scan Eye", "how much does an OCT scan cost");
  add("65855", "PRK Eye Surgery", "how much does PRK cost");

  // =========================================================================
  // ENT / HEAD & NECK
  // =========================================================================
  add("42820", "Tonsillectomy", "how much does a tonsillectomy cost");
  add("30520", "Septoplasty", "how much does septoplasty cost");
  add("42826", "Adenoidectomy", "how much does an adenoidectomy cost");
  add("69436", "Ear Tubes", "how much does ear tube surgery cost");
  add("30140", "Turbinate Reduction", "how much does turbinate reduction cost");
  add("31575", "Laryngoscopy", "how much does a laryngoscopy cost");
  add("42145", "Uvulopalatopharyngoplasty", "how much does UPPP surgery for sleep apnea cost");
  add("30400", "Rhinoplasty", "how much does a nose job cost");
  add("42700", "Tonsil Abscess Drainage", "how much does draining a peritonsillar abscess cost");
  add("69990", "Ear Surgery Microscope", "how much does ear surgery cost");

  // =========================================================================
  // UROLOGY
  // =========================================================================
  add("55250", "Vasectomy", "how much does a vasectomy cost");
  add("52000", "Cystoscopy", "how much does a cystoscopy cost");
  add("50590", "Kidney Stone Lithotripsy", "how much does kidney stone removal cost");
  add("52353", "Ureteroscopy", "how much does ureteroscopy cost");
  add("55866", "Robotic Prostatectomy", "how much does prostate surgery cost");
  add("55700", "Prostate Biopsy", "how much does a prostate biopsy cost");
  add("54150", "Circumcision", "how much does circumcision cost");
  add("52601", "TURP", "how much does TURP surgery cost");
  add("53445", "Penile Prosthesis", "how much does a penile implant cost");
  add("55040", "Hydrocelectomy", "how much does hydrocele surgery cost");
  add("54530", "Orchiectomy", "how much does orchiectomy cost");

  // =========================================================================
  // PHYSICAL THERAPY / REHABILITATION
  // =========================================================================
  add("97110", "Physical Therapy", "how much does physical therapy cost");
  add("97110", "PT Session", "how much does a physical therapy session cost without insurance");
  add("97140", "Manual Therapy", "how much does manual therapy cost");
  add("97530", "Therapeutic Activities", "how much does occupational therapy cost");
  add("92507", "Speech Therapy", "how much does speech therapy cost");
  add("97012", "Traction Therapy", "how much does spinal traction cost");
  add("97035", "Ultrasound Therapy", "how much does ultrasound therapy cost");
  add("98940", "Chiropractic Adjustment", "how much does a chiropractor visit cost");
  add("98941", "Chiropractic Spinal", "how much does a chiropractor cost without insurance");
  add("97032", "Electrical Stimulation", "how much does electrical stimulation therapy cost");

  // =========================================================================
  // LAB TESTS
  // =========================================================================
  add("80053", "Comprehensive Metabolic Panel", "how much does a blood test cost");
  add("85025", "CBC Blood Test", "how much does a CBC blood test cost");
  add("80061", "Lipid Panel", "how much does a cholesterol test cost");
  add("82947", "Glucose Test", "how much does a blood sugar test cost");
  add("84443", "TSH Thyroid Test", "how much does a thyroid test cost");
  add("81001", "Urinalysis", "how much does a urinalysis cost");
  add("87491", "STD Testing", "how much does STD testing cost");
  add("86803", "Hepatitis C Test", "how much does a hepatitis C test cost");
  add("87389", "HIV Test", "how much does an HIV test cost");
  add("82306", "Vitamin D Test", "how much does a vitamin D blood test cost");
  add("86580", "TB Test", "how much does a TB test cost");
  add("80048", "Basic Metabolic Panel", "how much does a metabolic panel cost");
  add("82570", "Creatinine Test", "how much does a creatinine test cost");
  add("83036", "Hemoglobin A1C", "how much does an A1C test cost");
  add("84153", "PSA Test", "how much does a PSA test cost");
  add("87624", "HPV Test", "how much does an HPV test cost");
  add("87086", "Urine Culture", "how much does a urine culture cost");
  add("86235", "ANA Test", "how much does an ANA test cost");
  add("86039", "Rheumatoid Factor", "how much does a rheumatoid factor test cost");
  add("82728", "Ferritin Test", "how much does an iron blood test cost");
  add("81528", "Cologuard", "how much does Cologuard cost");
  add("86900", "Blood Type Test", "how much does a blood type test cost");
  add("36415", "Blood Draw", "how much does a blood draw cost");
  add("87804", "Flu Test", "how much does a flu test cost");
  add("87811", "COVID Test", "how much does a COVID test cost");
  add("80307", "Drug Test", "how much does a drug test cost");
  add("84703", "Pregnancy Test", "how much does a pregnancy test at the doctor cost");
  add("86753", "Lyme Disease Test", "how much does a Lyme disease test cost");
  add("82248", "Liver Function Test", "how much does a liver function test cost");
  add("87340", "Hepatitis B Test", "how much does a hepatitis B test cost");
  add("86308", "Mono Test", "how much does a mono test cost");
  add("87880", "Strep Test", "how much does a strep test cost");
  add("82150", "Amylase Test", "how much does an amylase test cost");
  add("85610", "PT/INR Test", "how much does a PT INR test cost");

  // =========================================================================
  // GENETIC TESTING
  // =========================================================================
  add("81432", "BRCA Gene Test", "how much does BRCA genetic testing cost");
  add("81479", "Genetic Testing", "how much does genetic testing cost");
  add("81420", "Whole Exome Sequencing", "how much does whole exome sequencing cost");
  add("81507", "NIPT Prenatal Test", "how much does NIPT testing cost");
  add("81408", "Hereditary Cancer Panel", "how much does cancer genetic testing cost");

  // =========================================================================
  // CANCER TREATMENTS
  // =========================================================================
  add("77385", "Radiation Therapy IMRT", "how much does radiation therapy cost");
  add("77386", "Radiation IMRT Complex", "how much does cancer radiation treatment cost");
  add("77523", "Proton Therapy", "how much does proton therapy cost");
  add("96413", "Chemotherapy Infusion", "how much does chemotherapy cost");
  add("96413", "Chemo Session", "how much does a chemo session cost");
  add("96375", "Immunotherapy Infusion", "how much does immunotherapy cost");
  add("38240", "Bone Marrow Transplant", "how much does a bone marrow transplant cost");
  add("19301", "Breast Cancer Surgery", "how much does breast cancer treatment cost");
  add("55866", "Prostate Cancer Treatment", "how much does prostate cancer treatment cost");
  add("32480", "Lung Cancer Surgery", "how much does lung cancer surgery cost");
  add("77263", "Radiation Planning", "how much does cancer treatment cost");

  // =========================================================================
  // MENTAL HEALTH
  // =========================================================================
  add("90834", "Therapy Session 45 min", "how much does therapy cost");
  add("90837", "Therapy Session 60 min", "how much does therapy cost without insurance");
  add("90791", "Psychiatric Evaluation", "how much does a psychiatric evaluation cost");
  add("90792", "Psychiatric Evaluation with Medical", "how much does a psychiatrist cost");
  add("90832", "Therapy Session 30 min", "how much does a therapy session cost");
  add("90847", "Family Therapy", "how much does family therapy cost");
  add("90853", "Group Therapy", "how much does group therapy cost");
  add("96130", "Psychological Testing", "how much does psychological testing cost");
  add("96116", "Neuropsychological Testing", "how much does neuropsychological testing cost");
  add("90870", "ECT Treatment", "how much does electroconvulsive therapy cost");
  add("90867", "TMS Treatment", "how much does TMS therapy cost");
  add("90785", "Interactive Complexity", "how much does ADHD testing cost");
  add("90791", "Mental Health Assessment", "how much does a mental health evaluation cost");

  // =========================================================================
  // SLEEP MEDICINE
  // =========================================================================
  add("95810", "Sleep Study", "how much does a sleep study cost");
  add("95811", "Sleep Study with CPAP", "how much does a home sleep test cost");
  add("E0601", "CPAP Machine", "how much does a CPAP machine cost");

  // =========================================================================
  // NEUROLOGY
  // =========================================================================
  add("95819", "EEG", "how much does an EEG cost");
  add("95907", "EMG/Nerve Conduction", "how much does an EMG test cost");
  add("95910", "Nerve Conduction Study", "how much does a nerve conduction study cost");
  add("62270", "Lumbar Puncture", "how much does a lumbar puncture cost");
  add("64483", "Epidural Steroid Injection", "how much does an epidural injection cost");
  add("62323", "Epidural Injection", "how much does an epidural steroid injection cost");
  add("64635", "Radiofrequency Ablation", "how much does radiofrequency ablation cost");
  add("61510", "Brain Surgery", "how much does brain surgery cost");
  add("64561", "Nerve Stimulator", "how much does a nerve stimulator cost");

  // =========================================================================
  // ALLERGY / IMMUNOLOGY
  // =========================================================================
  add("95004", "Allergy Testing", "how much does allergy testing cost");
  add("95115", "Allergy Shots", "how much do allergy shots cost");
  add("95165", "Allergy Immunotherapy", "how much does allergy immunotherapy cost");
  add("86003", "Allergy Blood Test", "how much does an allergy blood test cost");
  add("95120", "Allergy Injection", "how much does an allergy shot cost without insurance");

  // =========================================================================
  // GASTROENTEROLOGY
  // =========================================================================
  add("91034", "Esophageal pH Study", "how much does an esophageal pH test cost");
  add("91010", "Esophageal Motility", "how much does an esophageal motility test cost");
  add("91200", "Liver Elastography", "how much does FibroScan cost");
  add("43242", "EUS Endoscopic Ultrasound", "how much does an endoscopic ultrasound cost");
  add("43260", "ERCP", "how much does an ERCP cost");

  // =========================================================================
  // PULMONOLOGY
  // =========================================================================
  add("94010", "Spirometry", "how much does a pulmonary function test cost");
  add("94060", "Bronchospasm Evaluation", "how much does spirometry cost");
  add("31622", "Bronchoscopy", "how much does a bronchoscopy cost");
  add("94729", "DLCO Test", "how much does a diffusion capacity test cost");

  // =========================================================================
  // VACCINES / PREVENTIVE
  // =========================================================================
  add("90471", "Vaccine Administration", "how much does a flu shot cost");
  add("90680", "Rotavirus Vaccine", "how much do baby vaccines cost");
  add("90715", "Tdap Vaccine", "how much does a Tdap shot cost");
  add("90651", "HPV Vaccine", "how much does the HPV vaccine cost");
  add("90662", "Flu Vaccine High Dose", "how much does a flu shot cost without insurance");
  add("90750", "Shingles Vaccine", "how much does the shingles vaccine cost");
  add("90589", "Rabies Vaccine", "how much does a rabies shot cost");
  add("90620", "Meningitis Vaccine", "how much does the meningitis vaccine cost");
  add("90460", "Childhood Vaccines", "how much does it cost to vaccinate a child");
  add("90696", "DTaP Vaccine", "how much does the DTaP vaccine cost");
  add("90686", "Flu Shot No Insurance", "how much does a flu shot cost at CVS");
  add("90732", "Pneumonia Vaccine", "how much does a pneumonia shot cost");

  // =========================================================================
  // ANESTHESIA
  // =========================================================================
  add("00100", "Anesthesia General", "how much does anesthesia cost");
  add("00100", "Anesthesia for Surgery", "how much does anesthesia cost for surgery");
  add("01996", "Epidural Anesthesia Labor", "how much does an epidural cost for labor");
  add("00142", "Sedation Anesthesia", "how much does sedation cost");
  add("99152", "Conscious Sedation", "how much does conscious sedation cost at the dentist");

  // =========================================================================
  // EMERGENCY PROCEDURES
  // =========================================================================
  add("12001", "Laceration Repair Simple", "how much does it cost to get stitches");
  add("12031", "Laceration Repair Intermediate", "how much does stitches cost in the ER");
  add("25600", "Cast Application Wrist", "how much does a cast cost for a broken arm");
  add("29105", "Long Arm Cast", "how much does it cost to cast a broken bone");
  add("99070", "Splint Application", "how much does a splint cost");
  add("99070", "Walking Boot", "how much does a walking boot cost");
  add("30901", "Nosebleed Treatment", "how much does it cost to cauterize a nosebleed");
  add("16020", "Burn Treatment", "how much does burn treatment cost");
  add("10060", "Abscess Drainage", "how much does abscess drainage cost");
  add("10120", "Foreign Body Removal", "how much does foreign body removal cost");

  // =========================================================================
  // AMBULANCE / TRANSPORT
  // =========================================================================
  add("A0427", "Ambulance BLS", "how much does an ambulance ride cost");
  add("A0429", "Ambulance ALS Emergency", "how much does an ambulance cost without insurance");
  add("A0431", "Ambulance ALS2", "how much does a helicopter ambulance cost");

  // =========================================================================
  // COSMETIC / PLASTIC (high search volume)
  // =========================================================================
  add("15824", "Facelift", "how much does a facelift cost");
  add("19325", "Breast Augmentation", "how much does breast augmentation cost");
  add("19318", "Breast Reduction", "how much does breast reduction cost");
  add("30400", "Rhinoplasty Cosmetic", "how much does rhinoplasty cost");
  add("17360", "Botox", "how much does Botox cost");
  add("11950", "Dermal Fillers", "how much does filler cost");
  add("15876", "Liposuction Abdomen", "how much does stomach liposuction cost");
  add("15847", "Neck Lift", "how much does a neck lift cost");
  add("19357", "Breast Lift", "how much does a breast lift cost");
  add("67900", "Brow Lift", "how much does a brow lift cost");
  add("15839", "Arm Lift", "how much does an arm lift cost");
  add("15832", "Thigh Lift", "how much does a thigh lift cost");
  add("15847", "Body Contouring", "how much does body contouring cost");
  add("19380", "Breast Reconstruction", "how much does breast reconstruction cost");
  add("15000", "CoolSculpting", "how much does CoolSculpting cost");
  add("17999", "Laser Hair Removal", "how much does laser hair removal cost");
  add("15783", "Tattoo Removal", "how much does tattoo removal cost");

  // =========================================================================
  // PAIN MANAGEMENT
  // =========================================================================
  add("62322", "Epidural Injection Lumbar", "how much does a lumbar epidural cost");
  add("64493", "Facet Joint Injection", "how much does a facet joint injection cost");
  add("27096", "SI Joint Injection", "how much does a sacroiliac joint injection cost");
  add("64400", "Nerve Block", "how much does a nerve block cost");
  add("62380", "Spinal Cord Stimulator", "how much does a spinal cord stimulator cost");
  add("20552", "Trigger Point Injection", "how much does a trigger point injection cost");
  add("64625", "Nerve Ablation", "how much does nerve ablation cost");
  add("20550", "Tendon Injection", "how much does a tendon injection cost");

  // =========================================================================
  // MISCELLANEOUS HIGH-SEARCH
  // =========================================================================
  add("99195", "Blood Transfusion", "how much does a blood transfusion cost");
  add("36430", "Blood Transfusion Admin", "how much does a unit of blood cost");
  add("99183", "Hyperbaric Oxygen", "how much does hyperbaric oxygen therapy cost");
  add("90281", "IV Therapy", "how much does IV therapy cost");
  add("96360", "IV Hydration", "how much does IV hydration cost");
  add("96365", "IV Infusion Therapy", "how much does an iron infusion cost");
  add("90378", "Synagis Injection", "how much does a Synagis injection cost");
  add("J3490", "Testosterone Injection", "how much does testosterone therapy cost");
  add("90399", "Allergy Drops", "how much do allergy drops cost");
  add("31500", "Intubation", "how much does intubation cost");

  // =========================================================================
  // DIALYSIS
  // =========================================================================
  add("90935", "Hemodialysis", "how much does dialysis cost");
  add("90945", "Dialysis Session", "how much does dialysis cost per session");
  add("90966", "Peritoneal Dialysis", "how much does peritoneal dialysis cost");
  add("50360", "Kidney Transplant", "how much does a kidney transplant cost");

  // =========================================================================
  // ADDITIONAL HIGH-VALUE SEARCHES
  // =========================================================================
  add("43246", "Feeding Tube Placement", "how much does a feeding tube cost");
  add("36561", "Port Placement", "how much does a port placement cost");
  add("36620", "Arterial Line", "how much does an arterial line cost");
  add("99221", "Hospital Stay Day 1", "how much does a hospital stay cost per day");
  add("99231", "Hospital Day Subsequent", "how much does a night in the hospital cost");
  add("99291", "ICU Care First Hour", "how much does ICU cost per day");
  add("99233", "Hospital Critical Care", "how much does a hospital bed cost per day");
  add("94003", "Ventilator Management", "how much does being on a ventilator cost per day");
  add("99234", "Observation Stay", "how much does hospital observation cost");

  // Rehabilitation / Long-term
  add("97161", "PT Evaluation", "how much does a physical therapy evaluation cost");
  add("97530", "Occupational Therapy Session", "how much does occupational therapy cost per session");
  add("92526", "Swallowing Therapy", "how much does swallowing therapy cost");
  add("97150", "Group PT Session", "how much does group physical therapy cost");

  // Podiatry
  add("28285", "Hammertoe Surgery", "how much does hammertoe surgery cost");
  add("11721", "Toenail Treatment", "how much does ingrown toenail removal cost");
  add("28292", "Bunionectomy", "how much does bunionectomy cost");
  add("28810", "Ankle Fusion", "how much does ankle fusion surgery cost");
  add("27702", "Ankle Replacement", "how much does ankle replacement surgery cost");

  // Endocrinology
  add("60500", "Parathyroidectomy", "how much does parathyroid surgery cost");
  add("60240", "Thyroidectomy", "how much does thyroid surgery cost");
  add("60220", "Thyroid Lobectomy", "how much does thyroid lobectomy cost");

  // Vascular
  add("36475", "Varicose Vein Treatment", "how much does varicose vein treatment cost");
  add("37765", "Vein Stripping", "how much does vein stripping cost");
  add("36478", "Endovenous Ablation", "how much does endovenous laser ablation cost");
  add("37228", "Peripheral Angioplasty", "how much does an angioplasty cost");
  add("35301", "Carotid Endarterectomy", "how much does carotid endarterectomy cost");

  return queries;
}

// ---------------------------------------------------------------------------
// Build queries from the DB consumer_descriptions table
// ---------------------------------------------------------------------------
async function buildQueriesFromDb(): Promise<ProcedureQuery[]> {
  console.log("Fetching consumer_descriptions from D1 via wrangler...");
  const { execSync } = await import("child_process");
  const result = execSync(
    `cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute medical-costs-db --remote --command "SELECT code, consumer_name FROM consumer_descriptions WHERE consumer_name NOT LIKE '%Durable Medical%' AND consumer_name NOT LIKE '%HCPCS%' LIMIT 21500" --json 2>/dev/null`,
    { maxBuffer: 50 * 1024 * 1024 }
  ).toString();

  const parsed = JSON.parse(result);
  const rows = parsed[0]?.results || [];
  console.log(`Got ${rows.length} procedures from DB`);

  return rows.map((r: any) => ({
    code: r.code,
    consumerName: r.consumer_name,
    query: `how much does ${r.consumer_name.toLowerCase()} cost`,
  }));
}

// ---------------------------------------------------------------------------
// DataForSEO API
// ---------------------------------------------------------------------------

interface PaaResult {
  id: string;
  procedureCode: string;
  query: string;
  question: string;
  answerSnippet: string | null;
  sourceUrl: string | null;
  sourceDomain: string | null;
  position: number;
}

async function queryDataForSeo(queries: ProcedureQuery[]): Promise<PaaResult[]> {
  const authToken = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString("base64");

  const body = queries.map((q) => ({
    keyword: q.query,
    location_code: 2840, // United States
    language_code: "en",
    device: "desktop",
  }));

  const response = await fetch(DATAFORSEO_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`DataForSEO API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as any;
  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO error: ${data.status_message}`);
  }

  const results: PaaResult[] = [];

  for (let taskIdx = 0; taskIdx < data.tasks.length; taskIdx++) {
    const task = data.tasks[taskIdx];
    if (task.status_code !== 20000 || !task.result?.[0]?.items) continue;

    const query = queries[taskIdx];
    const items = task.result[0].items;

    for (const item of items) {
      if (item.type !== "people_also_ask") continue;
      if (!item.items) continue;

      for (let pos = 0; pos < item.items.length; pos++) {
        const paaItem = item.items[pos];
        if (paaItem.type !== "people_also_ask_element") continue;

        const expanded = paaItem.expanded_element?.[0];
        const id = `${query.code}-${hashString(paaItem.title)}`;

        results.push({
          id,
          procedureCode: query.code,
          query: query.query,
          question: paaItem.title,
          answerSnippet: expanded?.description || null,
          sourceUrl: expanded?.url || null,
          sourceDomain: expanded?.domain || null,
          position: pos + 1,
        });
      }
    }
  }

  return results;
}

function hashString(s: string): string {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// ---------------------------------------------------------------------------
// D1 loading via wrangler
// ---------------------------------------------------------------------------

async function loadToD1(results: PaaResult[]): Promise<void> {
  if (results.length === 0) {
    console.log("No results to load.");
    return;
  }

  const { execSync } = await import("child_process");
  const batchSize = 50; // D1 has a limit per statement

  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    const values = batch
      .map((r) => {
        const esc = (s: string | null) => s ? `'${s.replace(/'/g, "''")}'` : "NULL";
        return `(${esc(r.id)}, ${esc(r.procedureCode)}, ${esc(r.query)}, ${esc(r.question)}, ${esc(r.answerSnippet)}, ${esc(r.sourceUrl)}, ${esc(r.sourceDomain)}, ${r.position})`;
      })
      .join(",\n");

    const sql = `INSERT OR REPLACE INTO people_also_ask (id, procedure_code, query, question, answer_snippet, source_url, source_domain, position) VALUES ${values};`;

    try {
      execSync(
        `cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute medical-costs-db --remote --command "${sql.replace(/"/g, '\\"')}"`,
        { maxBuffer: 10 * 1024 * 1024, stdio: "pipe" }
      );
      console.log(`  Loaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(results.length / batchSize)} (${batch.length} rows)`);
    } catch (err: any) {
      console.error(`  Error loading batch: ${err.message}`);
      // Try individual inserts as fallback
      for (const r of batch) {
        const esc = (s: string | null) => s ? `'${s.replace(/'/g, "''")}'` : "NULL";
        const singleSql = `INSERT OR REPLACE INTO people_also_ask (id, procedure_code, query, question, answer_snippet, source_url, source_domain, position) VALUES (${esc(r.id)}, ${esc(r.procedureCode)}, ${esc(r.query)}, ${esc(r.question)}, ${esc(r.answerSnippet)}, ${esc(r.sourceUrl)}, ${esc(r.sourceDomain)}, ${r.position});`;
        try {
          execSync(
            `cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute medical-costs-db --remote --command "${singleSql.replace(/"/g, '\\"')}"`,
            { maxBuffer: 10 * 1024 * 1024, stdio: "pipe" }
          );
        } catch (e2: any) {
          console.error(`    Failed single insert for "${r.question}": ${e2.message?.slice(0, 100)}`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const isTest = args.includes("--test");
  const isDryRun = args.includes("--dry-run");
  const fromDb = args.includes("--from-db");
  const batchArg = args.find((a) => a.startsWith("--batch"));
  const batchNum = batchArg ? parseInt(args[args.indexOf(batchArg) + 1] || "1", 10) : 1;

  console.log("=== People Also Ask Harvester ===\n");

  // Build query list
  let allQueries: ProcedureQuery[];
  if (fromDb) {
    allQueries = await buildQueriesFromDb();
  } else {
    allQueries = buildCuratedQueries();
  }

  console.log(`Total queries available: ${allQueries.length}`);

  // Slice by batch
  const start = (batchNum - 1) * QUERIES_PER_BATCH;
  const end = isTest ? start + 3 : start + QUERIES_PER_BATCH;
  const queries = allQueries.slice(start, end);

  if (queries.length === 0) {
    console.log(`No queries for batch ${batchNum} (start=${start}, total=${allQueries.length})`);
    return;
  }

  console.log(`Batch ${batchNum}: queries ${start + 1} to ${start + queries.length}`);
  console.log(`Estimated cost: $${(queries.length * 0.002).toFixed(2)}\n`);

  if (isDryRun) {
    console.log("--- DRY RUN: Preview queries ---");
    for (const q of queries.slice(0, 20)) {
      console.log(`  [${q.code}] ${q.query}`);
    }
    if (queries.length > 20) console.log(`  ... and ${queries.length - 20} more`);
    return;
  }

  // Process in mini-batches of BATCH_SIZE (3 per API call)
  let totalResults: PaaResult[] = [];
  let totalCost = 0;

  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const miniBatch = queries.slice(i, i + BATCH_SIZE);
    const batchLabel = `[${i + 1}-${i + miniBatch.length}/${queries.length}]`;

    try {
      console.log(`${batchLabel} Querying: ${miniBatch.map((q) => q.query.slice(0, 50)).join(" | ")}`);
      const results = await queryDataForSeo(miniBatch);
      totalResults.push(...results);
      totalCost += miniBatch.length * 0.002;
      console.log(`${batchLabel} Got ${results.length} PAA questions (running total: ${totalResults.length}, cost: $${totalCost.toFixed(3)})`);
    } catch (err: any) {
      console.error(`${batchLabel} ERROR: ${err.message}`);
    }

    // Rate limit between mini-batches
    if (i + BATCH_SIZE < queries.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
    }

    // Periodically save to D1 every 100 results
    if (totalResults.length >= 100) {
      console.log(`\n--- Saving ${totalResults.length} results to D1 ---`);
      await loadToD1(totalResults);
      totalResults = [];
    }
  }

  // Save remaining results
  if (totalResults.length > 0) {
    console.log(`\n--- Saving final ${totalResults.length} results to D1 ---`);
    await loadToD1(totalResults);
  }

  console.log(`\n=== Done! Total cost: $${totalCost.toFixed(3)} ===`);

  // Print summary
  const { execSync } = await import("child_process");
  try {
    const countResult = execSync(
      `cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute medical-costs-db --remote --command "SELECT COUNT(*) as total, COUNT(DISTINCT procedure_code) as procedures, COUNT(DISTINCT question) as unique_questions FROM people_also_ask" --json 2>/dev/null`,
      { maxBuffer: 10 * 1024 * 1024 }
    ).toString();
    const parsed = JSON.parse(countResult);
    const row = parsed[0]?.results?.[0];
    if (row) {
      console.log(`\nD1 Summary: ${row.total} total PAA rows, ${row.procedures} procedures, ${row.unique_questions} unique questions`);
    }
  } catch {
    console.log("(Could not fetch summary from D1)");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
