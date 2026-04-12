#!/usr/bin/env python3
"""
Parse CMS v3.0 JSON MRF files and extract negotiated rates for target procedure codes.
Outputs SQL INSERT statements for hospital_negotiated_rates table.
"""

import json
import sys
import os
import hashlib
import re

# Target CPT/HCPCS codes we want (top searched procedures for injury/accident)
TARGET_CODES = {
    # ER visits
    '99281', '99282', '99283', '99284', '99285',
    # Office visits
    '99213', '99214', '99215', '99201', '99202', '99203', '99204', '99205',
    # Imaging - MRI
    '72148', '72149', '72141', '72142', '72146', '72147',  # Spine MRI
    '70551', '70552', '70553',  # Brain MRI
    '73721', '73722', '73723',  # Lower extremity MRI (knee)
    '73221', '73222', '73223',  # Upper extremity MRI (shoulder)
    # Imaging - CT
    '70450', '70460',  # Head CT
    '74178', '74177', '74176',  # Abdomen/pelvis CT
    '71260', '71250',  # Chest CT
    '72125', '72126', '72131', '72132', '72133',  # Spine CT
    # Imaging - X-ray
    '73030', '73060', '73562', '73590', '72100', '72110', '71045', '71046',
    # Physical therapy
    '97110', '97140', '97161', '97162', '97163', '97530', '97112',
    # Orthopedic surgery
    '27447',  # Total knee replacement
    '27130',  # Total hip replacement
    '29881',  # Knee arthroscopy
    '27427',  # ACL reconstruction
    '23412',  # Rotator cuff repair
    # Spine surgery
    '22612', '22630', '63030', '63047', '22551',
    # Emergency procedures
    '99291', '99292',  # Critical care
    '12001', '12002', '12004', '12011', '12031',  # Laceration repair
    '25600', '25605',  # Distal radius fracture
    '27236', '27244', '27245',  # Hip fracture repair
    # Injections/pain management
    '20610', '20611',  # Joint injection
    '62322', '62323',  # Epidural injection
    '64483', '64484',  # Transforaminal epidural
    # Ambulance
    'A0427', 'A0429', 'A0433',
    # Other common
    '43239',  # Upper GI endoscopy
    '36415',  # Venipuncture
    '85025',  # CBC
    '80053',  # Comprehensive metabolic panel
    '93000',  # ECG
    '71046',  # Chest X-ray
}

# Also target common DRGs for inpatient
TARGET_DRGS = {
    '470', '471', '472',  # Hip/knee replacement
    '460', '461', '462',  # Spinal fusion
    '491', '492', '493',  # Back/neck procedures
    '480', '481', '482',  # Hip/femur procedures
    '064', '065', '066',  # Intracranial hemorrhage
    '560', '561', '562',  # Fracture procedures
    '602', '603',  # Cellulitis
    '689', '690',  # Kidney/urinary infections
    '811', '812',  # Poisoning/toxic effects
    '001', '002', '003',  # Heart transplant (just to be thorough)
    '291', '292', '293',  # Heart failure
    '190', '191', '192',  # COPD
    '247', '248', '249',  # Chest pain
    '897', '898',  # Alcohol/drug abuse
    '640', '641',  # Nutrition disorders
}


def derive_state(hospital_name, addresses):
    """Try to figure out state from hospital data."""
    # Check addresses for state codes
    if addresses:
        for addr in addresses if isinstance(addresses, list) else [addresses]:
            # Look for 2-letter state code pattern in address
            m = re.search(r',\s*([A-Z]{2})\s*,?\s*\d{5}', str(addr))
            if m:
                return m.group(1)
            m = re.search(r',\s*([A-Z]{2})\s*$', str(addr))
            if m:
                return m.group(1)

    # Guess from hospital name
    name_upper = hospital_name.upper()
    if 'TEXAS' in name_upper or 'HOUSTON' in name_upper or 'LUKES' in name_upper:
        return 'TX'
    if 'COLORADO' in name_upper or 'AURORA' in name_upper or 'HEALTHONE' in name_upper:
        return 'CO'
    if 'GEORGIA' in name_upper:
        return 'GA'
    if 'CHATTANOOGA' in name_upper or 'TENNESSEE' in name_upper:
        return 'TN'
    if 'KENTUCKY' in name_upper or 'MOUNT STERLING' in name_upper:
        return 'KY'
    if 'CALIFORNIA' in name_upper:
        return 'CA'
    return None


def make_id(hospital_name, code, payer_name, plan_name, setting):
    """Create a deterministic ID for upsert."""
    raw = f"{hospital_name}|{code}|{payer_name}|{plan_name}|{setting}"
    return hashlib.md5(raw.encode()).hexdigest()


def escape_sql(s):
    """Escape single quotes for SQL."""
    if s is None:
        return ''
    return str(s).replace("'", "''")


def parse_mrf_json(filepath, state_override=None):
    """Parse a CMS v3.0 JSON MRF file and yield rate records."""
    print(f"Parsing {filepath}...", file=sys.stderr)

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    hospital_name = data.get('hospital_name', 'Unknown Hospital')
    addresses = data.get('hospital_address', [])
    state = state_override or derive_state(hospital_name, addresses)

    # Try license info for state
    if not state:
        lic = data.get('license_information', {})
        state = lic.get('state')

    print(f"  Hospital: {hospital_name}, State: {state}", file=sys.stderr)

    items = data.get('standard_charge_information', [])
    print(f"  Total charge items: {len(items)}", file=sys.stderr)

    rates = []
    codes_found = set()

    for item in items:
        description = item.get('description', '')
        code_info_list = item.get('code_information', [])

        # Check if any code matches our targets
        matched_code = None
        matched_type = None

        for ci in code_info_list:
            code = str(ci.get('code', '')).strip()
            code_type = ci.get('type', '').upper()

            if code_type in ('CPT', 'HCPCS', 'CPT/HCPCS') and code in TARGET_CODES:
                matched_code = code
                matched_type = 'CPT' if code_type == 'CPT/HCPCS' else code_type
                break
            elif code_type == 'MS-DRG' and code in TARGET_DRGS:
                matched_code = code
                matched_type = 'DRG'
                break

        if not matched_code:
            continue

        codes_found.add(matched_code)

        # Extract payer-specific rates
        for charge_group in item.get('standard_charges', []):
            setting = charge_group.get('setting', 'unknown')

            payers_info = charge_group.get('payers_information', [])
            for payer in payers_info:
                payer_name = payer.get('payer_name', '')
                plan_name = payer.get('plan_name', '')
                rate = payer.get('standard_charge_dollar')
                methodology = payer.get('methodology', '')

                if rate is not None and float(rate) > 0:
                    # Clean plan name - extract main payer type
                    clean_payer = payer_name.strip()
                    clean_plan = plan_name.strip()

                    rates.append({
                        'hospital_name': hospital_name,
                        'hospital_state': state or 'XX',
                        'code': matched_code,
                        'code_type': matched_type,
                        'description': description[:200],
                        'payer_name': clean_payer,
                        'plan_name': clean_plan,
                        'negotiated_rate': float(rate),
                        'methodology': methodology,
                        'setting': setting,
                    })

    print(f"  Codes found: {sorted(codes_found)}", file=sys.stderr)
    print(f"  Rates extracted: {len(rates)}", file=sys.stderr)
    return rates


def generate_sql(rates):
    """Generate SQL INSERT statements."""
    if not rates:
        return ""

    statements = []
    batch = []
    batch_size = 50  # D1 has statement size limits

    for r in rates:
        rid = make_id(r['hospital_name'], r['code'], r['payer_name'], r['plan_name'], r['setting'])
        vals = (
            f"('{rid}', "
            f"'{escape_sql(r['hospital_name'])}', "
            f"'{escape_sql(r['hospital_state'])}', "
            f"'{escape_sql(r['code'])}', "
            f"'{escape_sql(r['code_type'])}', "
            f"'{escape_sql(r['description'])}', "
            f"'{escape_sql(r['payer_name'])}', "
            f"'{escape_sql(r['plan_name'])}', "
            f"{r['negotiated_rate']}, "
            f"'{escape_sql(r['methodology'])}', "
            f"'{escape_sql(r['setting'])}')"
        )
        batch.append(vals)

        if len(batch) >= batch_size:
            stmt = "INSERT OR REPLACE INTO hospital_negotiated_rates (id, hospital_name, hospital_state, code, code_type, description, payer_name, plan_name, negotiated_rate, methodology, setting) VALUES\n"
            stmt += ",\n".join(batch) + ";"
            statements.append(stmt)
            batch = []

    if batch:
        stmt = "INSERT OR REPLACE INTO hospital_negotiated_rates (id, hospital_name, hospital_state, code, code_type, description, payer_name, plan_name, negotiated_rate, methodology, setting) VALUES\n"
        stmt += ",\n".join(batch) + ";"
        statements.append(stmt)

    return "\n".join(statements)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: parse-mrf-json.py <file1.json> [file2.json ...] [--state XX]", file=sys.stderr)
        sys.exit(1)

    state_override = None
    files = []
    i = 1
    while i < len(sys.argv):
        if sys.argv[i] == '--state' and i + 1 < len(sys.argv):
            state_override = sys.argv[i + 1]
            i += 2
        else:
            files.append(sys.argv[i])
            i += 1

    all_rates = []
    for filepath in files:
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}", file=sys.stderr)
            continue
        try:
            rates = parse_mrf_json(filepath, state_override)
            all_rates.extend(rates)
        except Exception as e:
            print(f"Error parsing {filepath}: {e}", file=sys.stderr)

    print(f"\nTotal rates across all files: {len(all_rates)}", file=sys.stderr)

    # Print unique hospitals and payers
    hospitals = set(r['hospital_name'] for r in all_rates)
    payers = set(r['payer_name'] for r in all_rates)
    codes = set(r['code'] for r in all_rates)
    print(f"Hospitals: {len(hospitals)}", file=sys.stderr)
    print(f"Payers: {len(payers)}", file=sys.stderr)
    print(f"Unique codes: {len(codes)}", file=sys.stderr)

    sql = generate_sql(all_rates)
    print(sql)
