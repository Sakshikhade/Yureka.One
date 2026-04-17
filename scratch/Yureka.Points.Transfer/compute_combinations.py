import json
import re
import csv
from fractions import Fraction

with open('points_casa_main.html', 'r') as f:
    html = f.read()

match = re.search(r'window\.TRANSFER_TO_DATA\s*=\s*(\{.*?\});', html, re.DOTALL)
if not match:
    print("Data not found")
    exit(1)

data = json.loads(match.group(1))

# Build graph
# graph[from_name] = { to_name: { 'ratio': string, 'ratio_float': float, 'time': string, 'notes': string, 'category': string } }
graph = {}
from_categories = {}

for k, v in data.items():
    from_name = v['name']
    from_categories[from_name] = v.get('category', '')
    if from_name not in graph:
        graph[from_name] = {}
        
    for p in v.get('partners', []):
        to_name = p['name']
        graph[from_name][to_name] = {
            'ratio': p.get('transfer_ratio', ''),
            'ratio_float': p.get('transfer_ratio_float', 0.0),
            'time': p.get('transfer_time', ''),
            'notes': p.get('notes', ''),
            'category': p.get('category', '')
        }

# Generate all 1-hop and 2-hop combinations
all_combinations = {}

# 1-hop (Direct)
for from_name, partners in graph.items():
    for to_name, info in partners.items():
        key = (from_name, to_name, 'Direct')
        all_combinations[key] = {
            'From': from_name,
            'To': to_name,
            'From Category': from_categories.get(from_name, ''),
            'To Category': info['category'],
            'Ratio': info['ratio'],
            'Ratio Float': info['ratio_float'],
            'Transfer Time': info['time'],
            'Via': 'Direct',
            'Notes': info['notes'] or ''
        }

# 2-hop (Indirect)
for from_name, partners in graph.items():
    for mid_name, mid_info in partners.items():
        if mid_name in graph:
            for to_name, to_info in graph[mid_name].items():
                if from_name != to_name:
                    key = (from_name, to_name, mid_name)
                    
                    # Calculate ratio float
                    ratio_float = mid_info['ratio_float'] * to_info['ratio_float']
                    
                    # Estimate transfer time
                    time = f"{mid_info['time']} + {to_info['time']}"
                    notes = f"Estimated via {mid_name}."
                    
                    # Ratio string logic (simplified approximation)
                    # if mid is 1:0.9 and to is 50:13
                    # we will just put ratio_float to string for now if complex
                    
                    all_combinations[key] = {
                        'From': from_name,
                        'To': to_name,
                        'From Category': from_categories.get(from_name, ''),
                        'To Category': to_info['category'],
                        'Ratio': str(round(ratio_float, 4)),
                        'Ratio Float': ratio_float,
                        'Transfer Time': time,
                        'Via': mid_name,
                        'Notes': notes
                    }

print(f"Generated {len(all_combinations)} total combinations (direct + 1-stop).")

# Read existing CSV
existing_keys = set()
existing_rows = []
try:
    with open('Yureka_Points to Rewards - points_transfer_matrix.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        for row in reader:
            existing_rows.append(row)
            # key: (From, To, Via)
            via = row.get('Via', 'Direct').strip()
            if not via: via = 'Direct'
            key = (row['Transfer From'].strip(), row['Transfer To'].strip(), via)
            existing_keys.add(key)
            
            # also check if the via is implied
            if via == 'Direct' and row.get('Notes', '').startswith('Estimated via'):
                # it's actually indirect!
                pass # let's just use the exact matches
except Exception as e:
    print(f"Error reading CSV: {e}")

if not headers:
    headers = ['Transfer From', 'Transfer To', 'From Category', 'To Category', 'Ratio', 'Ratio Float', 'Transfer Time', 'Via', 'Notes']

# Add missing combinations
missing = []
for key, comb in all_combinations.items():
    if key not in existing_keys:
        missing.append({
            'Transfer From': comb['From'],
            'Transfer To': comb['To'],
            'From Category': comb['From Category'],
            'To Category': comb['To Category'],
            'Ratio': comb['Ratio'],
            'Ratio Float': comb['Ratio Float'],
            'Transfer Time': comb['Transfer Time'],
            'Via': comb['Via'],
            'Notes': comb['Notes']
        })

print(f"Found {len(missing)} missing combinations.")

# Write back to CSV
with open('Yureka_Points to Rewards - points_transfer_matrix.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(existing_rows)
    writer.writerows(missing)

print("Updated CSV with missing combinations.")
