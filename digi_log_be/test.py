def check_ignore(line:str):
    
    
    return line.endswith("Kurzbeschreibung des") or \
        line.startswith("Kurzbeschreibung des") or \
        line == "Qualifizierungsmoduls" or \
        line.startswith("Stand: ") or \
        not line


kurse = []
with open("kurs_data.txt", "r") as f:
    x = f.readlines()

    headers = (
        "Qualifizierungsbereich", 
        "Titel des Kurses",
        "Level",
        "Kurzbeschreibung/Untertitel des Moduls",
        "Inhalte des Kurses",
        "Methoden des Kurses",
        "Material/Unterlagen",
        "Wie oft wird der Kurs angeboten",
        "Kursdauer"
        )
    
    ignore = ("Kurzbeschreibung des Qualifizierungsmoduls")
    currend_header = ""
    add_str = ""
    header_ind = 0
    
    kurs = {}

    for i, line in enumerate(x):
        if line.startswith("Qualifizierungsbereich"):
            if kurs:
                kurs[currend_header] = add_str.rstrip()
                kurse.append(kurs)
            
            kurs= {}
            currend_header = "Qualifizierungsbereich"
        if line.rstrip().replace(":", "") in headers:
            if line.rstrip() == "Kursdauer":
                pass
            if add_str and currend_header:
                kurs[currend_header] = add_str.rstrip()
            currend_header = line.rstrip().replace(":", "")
            header_ind = i
        elif i == header_ind +1:
            add_str = line
        elif not check_ignore(line.rstrip()):
            add_str += line

    kurs[currend_header] = add_str.rstrip()

    from pprint import pprint
    pprint(kurse)
            # print(f[i+1])

import json

with open("out_clean.json", "w+") as j:

    json.dump(kurse, j, indent=4)
