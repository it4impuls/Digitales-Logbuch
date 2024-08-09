# Backend





## Entwickeln

### Vorraussetzungen

- Python
- vscode / vscodium

### Entwicklungsumgebung einrichten

* Diesen Ordner in VSCode öffnen und empfohlene addons installieren

* Virtuelle umgebung erstellen

```bash
python3 pip -m venv .venv
```
Falls dies in VSCode gemacht wurde, sollte es erkennen, dass eine neue virtuelle umgebung eingerichtet wurde und es sollte fragen, ob man diese als standart für dieses Projekt wählen will. Dies soll bejaht werden.

Libraries installieren
```bash
python3 pip install -r requirements.txt
```

### Test-DB aufsetzen
* evtl Variablen in dev.env anpassen
* Migration: F1 =>  run task => migrate (oder `python3 manage.py migrate`)
* superuser erstellen: F1 => run task => createsuperuser (oder `python3 manage.py createsuperuser`)

### Backend starten
* Debugger starten (F5 oder run=>start debugging)
* Der server läuft nun standardmäßig auf [localhost:8080](localhost:8080) (port kann in dev.env geändert werden)




## Deploy Production

Das Deployen wird von github actions übernommen.
Es wird automatisch ausgeführt, wenn ein PR gemerged wird.


