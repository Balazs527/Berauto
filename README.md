# BérAutó projekt

A projekt több gyökérmappás felépítésben van elkészítve. Jelenleg a backend működőképes, a frontend mappa pedig a későbbi kliensoldali fejlesztéshez elő van készítve.

## 

## 

## Mappák

|Mappa|Tartalom|
|-|-|
|`BACKEND/`|Python APIFlask backend, SQLAlchemy ORM modellek, SQLite adatbázis, Swagger dokumentáció|
|`FRONTEND/`|A későbbi kliensoldali alkalmazás helye|
|`DOCUMENTATION/`|Projekt-, adatbázis-, API- és frontendtervezési dokumentáció|
|`BerAuto.code-workspace`|VS Code multi-root workspace a teljes projekthez|

## 

## 

## Backend indítása

```powershell
cd BACKEND
python -m venv .venv
.\\\\\\\\.venv\\\\\\\\Scripts\\\\\\\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python init\\\\\\\_db.py
python run\\\\\\\_app.py
```





Swagger:

```text
http://localhost:8888/swagger
```





API ellenőrzés:

```text
http://localhost:8888/api/
```

## 

## 

## Teszt felhasználók

|Szerep|E-mail|Jelszó|Megjegyzés|
|-|-|-|-|
|Admin|admin@berauto.hu|admin123|Admin oldalak, autókezelés, napló.|
|Ügyintéző|ugyintezo@berauto.hu|ugyintezo123|Ügyintézői oldalak, kölcsönzések kezelése.|
|Felhasználó|teszt@berauto.hu|teszt123|Felhasználói oldalak, saját kölcsönzések.|



## 

## 

## Dokumentáció

A részletes dokumentáció a `DOCUMENTATION/` mappában található. Kezdéshez ajánlott fájl:

```text
DOCUMENTATION/README.md
```

## 

## 

## Visual Studio Code

A teljes projekt megnyitásához használd ezt:

```text
BerAuto.code-workspace
```

Ez egyszerre nyitja meg a `BACKEND/`, `FRONTEND/` és `DOCUMENTATION/` mappákat.







