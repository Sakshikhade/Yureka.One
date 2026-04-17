import json
import re

with open('points_casa_main.html', 'r') as f:
    html = f.read()

match = re.search(r'window\.TRANSFER_TO_DATA\s*=\s*(\{.*?\});', html, re.DOTALL)
if match:
    data = json.loads(match.group(1))
    
    # how many direct transfers are there?
    direct_transfers = 0
    for from_id, from_obj in data.items():
        direct_transfers += len(from_obj.get('partners', []))
        
    print(f"Loaded {len(data)} 'From' programs.")
    print(f"Total direct transfers: {direct_transfers}")
else:
    print("No TRANSFER_TO_DATA found.")
