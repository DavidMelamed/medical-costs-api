#!/usr/bin/env python3
"""
Streaming parser for CMS v3.0 JSON MRF files.
Uses ijson to handle large/truncated files without loading into memory.
"""

import ijson
import sys
import os
import hashlib
import re

# Target CPT/HCPCS codes
TARGET_CODES = {
    '99281', '99282', '99283', '99284', '99285',
    '99213', '99214', '99215', '99201', '99202', '99203', '99204', '99205',
    '72148', '72149', '72141', '72142', '72146', '72147',
    '70551', '70552', '70553',
    '73721', '73722', '73723',
    '73221', '73222', '73223',
    '70450', '70460',
    '74178', '74177', '74176',
    '71260', '71250',
    '72125', '72126', '72131', '72132', '72133',
    '73030', '73060', '73562', '73590', '72100', '72110', '71045', '71046',
    '97110', '97140', '97161', '97162', '97163', '97530', '97112',
    '27447', '27130', '29881', '27427', '23412',
    '22612', '22630', '63030', '63047', '22551',
    '99291', '99292',
    '12001', '12002', '12004', '12011', '12031',
    '25600', '25605',
    '27236', '27244', '27245',
    '20610', '20611',
    '62322', '62323',
    '64483', '64484',
    'A0427', 'A0429', 'A0433',
    '43239', '36415', '85025', '80053', '93000', '71046',
}

TARGET_DRGS = {
    '470', '471', '472', '460', '461', '462', '491', '492', '493',
    '480', '481', '482', '064', '065', '066', '560', '561', '562',
    '602', '603', '689', '690', '811', '812', '001', '002', '003',
    '291', '292', '293', '190', '191', '192', '247', '248', '249',
    '897', '898', '640', '641',
}


def make_id(hospital_name, code, payer_name, plan_name, setting):
    raw = f"{hospital_name}|{code}|{payer_name}|{plan_name}|{setting}"
    return hashlib.md5(raw.encode()).hexdigest()


def escape_sql(s):
    if s is None:
        return ''
    return str(s).replace("'", "''")


def derive_state_from_name(hospital_name):
    name_upper = hospital_name.upper()
    state_hints = {
        'TX': ['TEXAS', 'HOUSTON', 'LUKES HEALTH', 'BRAZOSPORT', 'SUGAR LAND', 'WOODLANDS', 'VINTAGE', 'SPRINGWOOD', 'COLLEGE STATION', 'BAYLOR'],
        'CO': ['COLORADO', 'AURORA', 'HEALTHONE', 'DENVER', 'PRESBYTERIAN ST', 'MOUNTAIN RIDGE', 'SWEDISH', 'ROSE', 'SKY RIDGE', 'SPALDING', 'CENTENNIAL', 'NORTH SUBURBAN'],
        'TN': ['CHATTANOOGA', 'TENNESSEE', 'MEMORIAL HOSP'],
        'GA': ['GEORGIA'],
        'KY': ['KENTUCKY', 'MOUNT STERLING', 'SAINT JOSEPH'],
        'CA': ['CALIFORNIA', 'KAISER', 'ANTIOCH', 'OAKLAND', 'SAN FRANCISCO', 'FREMONT', 'FRESNO', 'REDWOOD', 'RICHMOND', 'ROSEVILLE', 'SACRAMENTO', 'SAN JOSE'],
    }
    for state, hints in state_hints.items():
        for hint in hints:
            if hint in name_upper:
                return state
    return None


def parse_streaming(filepath, state_override=None):
    """Stream-parse a CMS v3.0 JSON MRF file."""
    print(f"Streaming parse: {filepath}", file=sys.stderr)

    rates = []
    hospital_name = 'Unknown'
    hospital_state = state_override
    item_count = 0

    try:
        with open(filepath, 'rb') as f:
            # First get hospital metadata
            parser = ijson.parse(f, use_float=True)

            # Track current item structure
            current_item = {}
            current_codes = []
            current_charges = []
            current_payers = []
            in_item = False
            depth = 0

            for prefix, event, value in parser:
                # Get hospital name
                if prefix == 'hospital_name' and event == 'string':
                    hospital_name = value
                    if not hospital_state:
                        hospital_state = derive_state_from_name(hospital_name)
                    print(f"  Hospital: {hospital_name}, State: {hospital_state}", file=sys.stderr)
                    continue

                # Get state from license
                if prefix == 'license_information.state' and event == 'string' and not hospital_state:
                    hospital_state = value
                    continue

                # Track standard_charge_information items
                if prefix == 'standard_charge_information.item' and event == 'start_map':
                    in_item = True
                    current_item = {'description': '', 'codes': [], 'charges': []}
                    item_count += 1
                    if item_count % 5000 == 0:
                        print(f"  Processed {item_count} items, {len(rates)} rates so far...", file=sys.stderr)
                    continue

                if prefix == 'standard_charge_information.item' and event == 'end_map':
                    in_item = False
                    # Process the completed item
                    matched_code = None
                    matched_type = None

                    for ci in current_item['codes']:
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

                    if matched_code:
                        for charge in current_item['charges']:
                            setting = charge.get('setting', 'unknown')
                            for payer in charge.get('payers', []):
                                rate_val = payer.get('standard_charge_dollar')
                                if rate_val and float(rate_val) > 0:
                                    rates.append({
                                        'hospital_name': hospital_name,
                                        'hospital_state': hospital_state or 'XX',
                                        'code': matched_code,
                                        'code_type': matched_type,
                                        'description': current_item['description'][:200],
                                        'payer_name': payer.get('payer_name', ''),
                                        'plan_name': payer.get('plan_name', ''),
                                        'negotiated_rate': float(rate_val),
                                        'methodology': payer.get('methodology', ''),
                                        'setting': setting,
                                    })

                    current_item = {'description': '', 'codes': [], 'charges': []}
                    continue

                if not in_item:
                    continue

                # Collect item fields
                if prefix == 'standard_charge_information.item.description' and event == 'string':
                    current_item['description'] = value

                # Code information
                elif prefix == 'standard_charge_information.item.code_information.item' and event == 'end_map':
                    pass  # handled by individual fields
                elif prefix == 'standard_charge_information.item.code_information.item.code':
                    if event in ('string', 'number'):
                        if not current_item['codes'] or 'code' in current_item['codes'][-1]:
                            current_item['codes'].append({'code': str(value)})
                        else:
                            current_item['codes'][-1]['code'] = str(value)
                elif prefix == 'standard_charge_information.item.code_information.item.type' and event == 'string':
                    if current_item['codes']:
                        current_item['codes'][-1]['type'] = value
                    else:
                        current_item['codes'].append({'type': value})
                elif prefix == 'standard_charge_information.item.code_information.item' and event == 'start_map':
                    current_item['codes'].append({})

                # Standard charges
                elif prefix == 'standard_charge_information.item.standard_charges.item' and event == 'start_map':
                    current_item['charges'].append({'setting': 'unknown', 'payers': []})
                elif prefix == 'standard_charge_information.item.standard_charges.item.setting' and event == 'string':
                    if current_item['charges']:
                        current_item['charges'][-1]['setting'] = value

                # Payer info
                elif prefix == 'standard_charge_information.item.standard_charges.item.payers_information.item' and event == 'start_map':
                    if current_item['charges']:
                        current_item['charges'][-1]['payers'].append({})
                elif prefix == 'standard_charge_information.item.standard_charges.item.payers_information.item.payer_name' and event == 'string':
                    if current_item['charges'] and current_item['charges'][-1]['payers']:
                        current_item['charges'][-1]['payers'][-1]['payer_name'] = value
                elif prefix == 'standard_charge_information.item.standard_charges.item.payers_information.item.plan_name' and event == 'string':
                    if current_item['charges'] and current_item['charges'][-1]['payers']:
                        current_item['charges'][-1]['payers'][-1]['plan_name'] = value
                elif prefix == 'standard_charge_information.item.standard_charges.item.payers_information.item.standard_charge_dollar':
                    if event in ('number', 'string') and current_item['charges'] and current_item['charges'][-1]['payers']:
                        current_item['charges'][-1]['payers'][-1]['standard_charge_dollar'] = value
                elif prefix == 'standard_charge_information.item.standard_charges.item.payers_information.item.methodology' and event == 'string':
                    if current_item['charges'] and current_item['charges'][-1]['payers']:
                        current_item['charges'][-1]['payers'][-1]['methodology'] = value

    except ijson.IncompleteJSONError:
        print(f"  File truncated after {item_count} items, {len(rates)} rates recovered", file=sys.stderr)
    except Exception as e:
        print(f"  Error at item {item_count}: {e}", file=sys.stderr)

    print(f"  Total items: {item_count}, Rates: {len(rates)}", file=sys.stderr)

    # Unique stats
    codes = set(r['code'] for r in rates)
    payers = set(r['payer_name'] for r in rates)
    print(f"  Unique codes: {len(codes)}, Payers: {len(payers)}", file=sys.stderr)

    return rates


def generate_sql(rates):
    if not rates:
        return ""

    statements = []
    batch = []
    batch_size = 50

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
        print("Usage: parse-mrf-streaming.py <file1.json> [file2.json ...]", file=sys.stderr)
        sys.exit(1)

    all_rates = []
    for filepath in sys.argv[1:]:
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}", file=sys.stderr)
            continue
        rates = parse_streaming(filepath)
        all_rates.extend(rates)

    print(f"\n=== TOTAL: {len(all_rates)} rates from {len(set(r['hospital_name'] for r in all_rates))} hospitals ===", file=sys.stderr)

    sql = generate_sql(all_rates)
    print(sql)
