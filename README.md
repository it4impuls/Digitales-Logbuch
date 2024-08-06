# Digitales-Logbuch / Kursplan

Der Kursplean ist eine Weboberfläche, in der man Kurse erstellen kann un in dem sich Nutzer zu diesen kursen anmelden können.


## Adressen

### Datenbank

IP: 192.168.100.242 (db@db.impulsreha.local)

### Web-server
addr: 192.168.100.165 (kursplan@kursplan.impulsreha.local)


## Docker Images
up-to-date Images sind [hier](https://github.com/it4impuls?tab=packages&repo_name=Digitales-Logbuch) zu finden. Diese werden automatisch beim mergen eines PRs erstellt.

### Start variablen
Die docker Container benötigen env-Variablen, um gestartet zu werden. Die Variablen für das automatische deployen kann vom REPO-INHABER [hier](https://github.com/it4impuls/Digitales-Logbuch/settings/secrets/actions) heändert werden.

Vereinfacter run Befehl backend von [.github/workflows/prod-deploy-backend.yml](https://github.com/it4impuls/Digitales-Logbuch/blob/c208ec18eb2ddddeb702a50dfc9436789eb86290/.github/workflows/prod-deploy-backend.yml#L70)
```bash
docker run -d -p 8080:${{ vars.BACKEND_PORT }} 
    -e DJANGO_SUPERUSER_PASSWORD=${{ secrets.DJANGO_SUPERUSER_PASSWORD }}
    -e DJANGO_SUPERUSER_EMAIL=${{ vars.DJANGO_SUPERUSER_EMAIL }}
    -e DJANGO_SUPERUSER_USERNAME=${{ vars.DJANGO_SUPERUSER_USERNAME }}
    -e DB_NAME=${{ vars.DB_NAME }}
    -e DB_USER=${{ vars.DB_USER }}
    -e DB_PASSWORD=${{ secrets.DB_PASSWORD }}
    -e DB_ADDR=${{ vars.DB_ADDR }}
    -e DB_PORT=${{ vars.DB_PORT }}
    -e DB_ENGINE=${{ vars.DB_ENGINE }}
    --restart=always
    ghcr.io/it4impuls/digitales-logbuch_be:main
```

* BACKEND_PORT:               Port, auf der das backend laufen soll. (Wenn der Port geändert wird, muss das Frontend image neu gebaut werden, da es beim Image-bauen bereits den Port braucht. Siehe [.github/workflows/prod-deploy-frontend.yml](https://github.com/it4impuls/Digitales-Logbuch/blob/c208ec18eb2ddddeb702a50dfc9436789eb86290/.github/workflows/prod-deploy-frontend.yml#L58))
* DJANGO_SUPERUSER_PASSWORD:  
Passwort für den admin-account des Servers

* DJANGO_SUPERUSER_EMAIL:     
Email für den admin-account des Servers

* DJANGO_SUPERUSER_USERNAME:  
Benutzername für den admin-account des Servers

* DB_NAME:                    
Name der Datenbank-Tabelle

* DB_USER:                    
Benutzername für den Datenbanknutzer, mit dem das Backend die Datenbank ändern kann. Benötigt Lese/Schreib Rechte in der Datenbank-Tabelle

* DB_PASSWORD:                
Passwort für den Datenbanknutzer

* DB_ADDR:                    
Web-Adresse des Datenbankservers

* DB_PORT:                    
Port des Datenbankservers

* DB_ENGINE:                  
Art der Datenbank (mysql, oracle, sqlite3, postgresql)




## Allgemeine Informationen

Frontend und Backend sind komplett getrennt. Zum Entwickeln ist es zu empfehlen den jeweiligen unterordner (digi_log_be / digi_log_fe) als Projekt zu öffnen.
In den Ordnern sind auch auch vscode config dateien zu finden.

Für Informationen zu den jeweiligen Projekt siehe die README in den Ordnern


## Github Actions
Es gibt zwei Arten von Github-Actions:
* Tests, die Automatisch ausgeführt werden, wenn ein PR erstellt wird, der das Backend oder Frontend ändert. Der PR sollte nicht gemerged werden, wenn ein Test Fehlschlägt.
* Deployment, die ausgeführt werden, wenn ein PR gemerged wird. Dieser macht Automatisch ein docker image, und führt diesen auf dem server aus.

## Example Workflow
Guide angepasst von [hier](https://github.com/CleverRaven/Cataclysm-DDA/blob/main/doc/CONTRIBUTING.md#example-workflow)



#### Setup your environment

#### Update your `main` branch

1. Make sure you have your `main` branch checked out.

```bash
$ git checkout main
```

2. Pull the changes from the `upstream/main` branch.

```bash
$ git pull --ff-only upstream main
```

4. For each new feature or bug fix, create a new branch.

```bash
# Creates a new branch called "new_feature" and switches to it
$ git checkout -b new_feature
```



5. Once you've committed some changes locally, you need to push them to your fork here on GitHub.

```bash
# origin was automatically set to point to your fork when you cloned it
$ git push origin new_feature
```

6. now make your changes

7. Once you're finished working on your branch, and have committed and pushed all your changes, submit a pull request from your `new_feature` branch to this repository's `main` branch.

 * Note: any new commits to the `new_feature` branch on GitHub will automatically be included in the pull request, so make sure to only commit related changes to the same branch.


Wenn ein PR erstellt wird, starten automatisch Tests. Wenn Ein Test scheitern sollte, schau dir genau an, was gescheitert ist. Wenn Annahmen vom Test geändert wurden, ändere den Test an, damit es die neuen annahmen wiederspiegelt. Wenn an den Annahmen nicht geändert hat, funktioniert das Feature, welches getestet wurde nichtmehr und der der neue Code muss angepasst werden, bis dieses Feature wieder Funktioniert.

Sobald alle Tests erfolgreich abgeschlossen sind, kann der PR gemerged werden.

Wenn der PR gemerged ist, startet automatisch das deployen der Seite. nach ca 10 minuten ist dies abgeschlossen und die Seite hat das neue Feature.