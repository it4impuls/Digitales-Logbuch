# Digitales-Logbuch / Kursplan

Der Kursplean ist eine Weboberfläche, in der man Kurse erstellen kann un in dem sich Nutzer zu diesen kursen anmelden können.


## Adressen

### Datenbank

IP: 192.168.100.242 (db@db.impulsreha.local)

### Web-server
addr: 192.168.100.165 (kursplan@kursplan.impulsreha.local)




## Allgemeine Informationen

Frontend und Backend sind komplett getrennt. Zum Entwickeln ist es zu empfehlen den jeweiligen unterordner (digi_log_be / digi_log_fe) als Projekt zu öffnen.
In den Ordnern sind auch auch vscode config dateien zu finden.

Für Informationen zu den jeweiligen Projekt siehe die README in den Ordnern

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