import csv
import json

data = []
with open('Yureka_Points to Rewards - points_transfer_matrix.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append(row)

js_content = "const transferMatrix = " + json.dumps(data) + ";"
with open('data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Created data.js successfully.")
