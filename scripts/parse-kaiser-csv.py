#!/usr/bin/env python3
"""Parse Kaiser Permanente CMS v3.0 wide-format CSV from stdin."""
import sys
import csv
import hashlib

hospital_name = sys.argv[1] if len(sys.argv) > 1 else "Kaiser Permanente"
hospital_state = sys.argv[2] if len(sys.argv) > 2 else "CA"

TARGET_CODES = {
    '99281','99282','99283','99284','99285',
    '99213','99214','99215','99201','99202','99203','99204','99205',
    '72148','72149','72141','72142','72146','72147',
    '70450','70460','70551','70552','70553',
    '73721','73722','73723','73221','73222','73223',
    '74178','74177','74176','71260','71250',
    '72125','72126','72131','72132','72133',
    '73030','73060','73562','73590','72100','72110','71045','71046',
    '97110','97140','97161','97162','97163','97530','97112',
    '27447','27130','29881','27427','23412',
    '22612','22630','63030','63047','22551',
    '99291','99292',
    '12001','12002','12004','12011','12031',
    '25600','25605','27236','27244','27245',
    '20610','20611','62322','62323','64483','64484',
    'A0427','A0429','A0433',
    '43239','36415','85025','80053','93000',
}

reader = csv.reader(sys.stdin)
next(reader)  # metadata row 1
next(reader)  # metadata row 2
headers = next(reader)

# Find payer columns (commercial and medicare dollar amounts)
payer_cols = []
for i, h in enumerate(headers):
    hl = h.lower().strip()
    if 'negotiated_dollar' in hl:
        # Extract payer and plan from column name pattern:
        # standard_charge|[PAYER]|[PLAN]|negotiated_dollar
        parts = h.split('|')
        if len(parts) >= 3:
            payer = parts[1].strip('[] ')
            plan = parts[2].strip('[] ')
            payer_cols.append((i, payer, plan))

# Find methodology columns
method_cols = {}
for i, h in enumerate(headers):
    if 'methodology' in h.lower():
        parts = h.split('|')
        if len(parts) >= 3:
            key = (parts[1].strip('[] '), parts[2].strip('[] '))
            method_cols[key] = i

code1_idx = next((i for i,h in enumerate(headers) if h == 'code|1'), 1)
code1_type_idx = next((i for i,h in enumerate(headers) if h == 'code|1|type'), 2)
setting_idx = next((i for i,h in enumerate(headers) if h == 'setting'), 6)

print(f"Found {len(payer_cols)} payer columns", file=sys.stderr)

rates = []
for row in reader:
    if len(row) < 10:
        continue
    code = row[code1_idx].strip()
    if code not in TARGET_CODES:
        continue

    code_type_raw = row[code1_type_idx].strip().upper() if code1_type_idx < len(row) else ''
    code_type = 'CPT' if code_type_raw in ('CPT', 'CPT/HCPCS', 'HCPCS') else code_type_raw
    desc = row[0][:200].replace("'", "''")
    setting = row[setting_idx] if setting_idx < len(row) else 'unknown'

    for col_idx, payer, plan in payer_cols:
        if col_idx >= len(row):
            continue
        rate_str = row[col_idx].strip()
        if not rate_str:
            continue
        try:
            rate = float(rate_str)
        except:
            continue
        if rate <= 0:
            continue

        method_key = (payer, plan)
        method = ''
        if method_key in method_cols and method_cols[method_key] < len(row):
            method = row[method_cols[method_key]].strip()

        rid = hashlib.md5(f"{hospital_name}|{code}|{payer}|{plan}|{setting}".encode()).hexdigest()
        rates.append(
            f"('{rid}', '{hospital_name.replace(chr(39),chr(39)*2)}', '{hospital_state}', "
            f"'{code}', '{code_type}', '{desc}', "
            f"'{payer.replace(chr(39),chr(39)*2)}', '{plan}', "
            f"{rate}, '{method}', '{setting}')"
        )

print(f"Total rates: {len(rates)}", file=sys.stderr)

batch_size = 50
for i in range(0, len(rates), batch_size):
    batch = rates[i:i+batch_size]
    print("INSERT OR REPLACE INTO hospital_negotiated_rates (id, hospital_name, hospital_state, code, code_type, description, payer_name, plan_name, negotiated_rate, methodology, setting) VALUES")
    print(",\n".join(batch) + ";")
