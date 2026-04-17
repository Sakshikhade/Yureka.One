from bs4 import BeautifulSoup
import json

with open("points_casa_main.html", "r") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
buttons = soup.find_all("button", class_="program-option")
programs = []
for btn in buttons:
    prg = {
        "id": btn.get("data-program-id"),
        "name": btn.get("data-program-name"),
        "slug": btn.get("data-program-slug"),
        "category": btn.get("data-program-category")
    }
    # only add if id is present and it's not already in the list
    if prg["id"] and prg not in programs:
        programs.append(prg)

with open("programs.json", "w") as f:
    json.dump(programs, f, indent=2)

print(f"Extracted {len(programs)} unique programs")
