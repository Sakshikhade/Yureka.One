import json
import re
import csv
from fractions import Fraction

with open('points_casa_main.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'window\.TRANSFER_TO_DATA\s*=\s*(\{.*?\});', html, re.DOTALL)
if not match:
    print("Data not found")
    exit(1)

data = json.loads(match.group(1))

# Parse a ratio string into a multiplier (B / A)
def parse_ratio_to_multiplier(ratio_str, fallback_float):
    if not ratio_str: 
        return fallback_float or 1.0
    r = ratio_str.strip()
    
    # fix broken values like '50:13:00' which is an excel time corruption for '50:13'
    if ':' in r:
        parts = r.split(':')
        try:
            A = float(parts[0])
            B = float(parts[1])
            if A == 0: return 0.0
            return B / A
        except ValueError:
            pass
    return fallback_float or 1.0

graph = {}
from_categories = {}

for k, v in data.items():
    from_name = v['name']
    from_categories[from_name] = v.get('category', '')
    if from_name not in graph:
        graph[from_name] = {}
        
    for p in v.get('partners', []):
        to_name = p['name']
        mult = parse_ratio_to_multiplier(p.get('transfer_ratio'), p.get('transfer_ratio_float'))
        graph[from_name][to_name] = {
            'multiplier': mult,
            'time': p.get('transfer_time', ''),
            'notes': p.get('notes', ''),
            'category': p.get('category', '')
        }

all_combinations = {}

# 1-hop
for from_name, partners in graph.items():
    for to_name, info in partners.items():
        key = (from_name, to_name, 'Direct')
        mult = info['multiplier']
        
        # generate clean ratio string
        frac = Fraction(mult).limit_denominator(100)
        ratio_str = f"{frac.denominator}:{frac.numerator}" if mult > 0 else "1:1"
        
        # We store float_ratio as (1 / mult) because JS does points / float_ratio
        float_ratio = (1 / mult) if mult > 0 else 1.0
        
        all_combinations[key] = {
            'Transfer From': from_name,
            'Transfer To': to_name,
            'From Category': from_categories.get(from_name, ''),
            'To Category': info['category'],
            'Ratio': ratio_str,
            'Ratio Float': float_ratio,
            'Transfer Time': info['time'],
            'Via': 'Direct',
            'Notes': info['notes'] or '',
            'Multiplier': mult
        }

# 2-hop
for from_name, partners in graph.items():
    for mid_name, mid_info in partners.items():
        if mid_name in graph:
            for to_name, to_info in graph[mid_name].items():
                if from_name != to_name:
                    key = (from_name, to_name, mid_name)
                    
                    mult = mid_info['multiplier'] * to_info['multiplier']
                    
                    # generate clean ratio string
                    frac = Fraction(mult).limit_denominator(100)
                    ratio_str = f"{frac.denominator}:{frac.numerator}" if mult > 0 else "1:1"
                    
                    float_ratio = (1 / mult) if mult > 0 else 1.0
                    time = f"{mid_info['time']} + {to_info['time']}"
                    notes = f"Estimated via {mid_name}."
                    
                    all_combinations[key] = {
                        'Transfer From': from_name,
                        'Transfer To': to_name,
                        'From Category': from_categories.get(from_name, ''),
                        'To Category': to_info['category'],
                        'Ratio': ratio_str,
                        'Ratio Float': float_ratio,
                        'Transfer Time': time,
                        'Via': mid_name,
                        'Notes': notes,
                        'Multiplier': mult
                    }

# Write CSV
headers = ['Transfer From', 'Transfer To', 'From Category', 'To Category', 'Ratio', 'Ratio Float', 'Transfer Time', 'Via', 'Notes']
output_rows = []
for key in sorted(all_combinations.keys()):
    row = all_combinations[key]
    del row['Multiplier'] # remove internal 
    output_rows.append(row)

with open('Yureka_Points to Rewards - points_transfer_matrix.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(output_rows)

print(f"Generated {len(output_rows)} fully refined combinations with precise math.")

# Update data.js
js_content = "const transferMatrix = " + json.dumps(output_rows) + ";"
with open('data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
    
print("Updated data.js cleanly.")
