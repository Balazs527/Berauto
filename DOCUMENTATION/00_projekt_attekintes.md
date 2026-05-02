# BérAutó projekt - dokumentációs áttekintés

A projekt három fő gyökérmappára van bontva:

* `BACKEND/`: a működő Python APIFlask backend.
* `FRONTEND/`: a későbbi kliensoldali alkalmazás előkészített helye.
* `DOCUMENTATION/`: a projektet bemutató adatbázis-, végpont-, kliensoldali és futtatási dokumentáció.

## 

## 

## 

## Jelenlegi állapot

|Rész|Állapot|Megjegyzés|
|-|-|-|
|Backend|Elkészült|APIFlask, SQLAlchemy ORM, SQLite adatbázis, JWT token, szerepkör alapú védelem|
|Frontend|Előkészített mappa|A kliensoldali fejlesztéshez oldalak, komponensek és service-ek tervezése készült|
|Dokumentáció|Frissítve|Az utak már az új `BACKEND/`, `FRONTEND/`, `DOCUMENTATION/` felépítést használják|
|Adatbázis|Elkészült|`BACKEND/berauto.db`, `BACKEND/database.sql`, `BACKEND/init\_db.py`|
|Swagger|Elérhető|`http://localhost:8888/swagger`|

## 

## 

## 

## Fontos elérési utak

|Elem|Új elérési út|Mire való?|
|-|-|-|
|Backend indítófájl|`BACKEND/run\_app.py`|A Python API szerver indítása|
|Adatbázis inicializálás|`BACKEND/init\_db.py`|Táblák újragenerálása és kezdő adatok betöltése|
|SQL séma|`BACKEND/database.sql`|Az adatbázis szerkezetének leírása|
|SQLite adatbázis|`BACKEND/berauto.db`|Fejlesztéshez használt adatbázis|
|API modellek|`BACKEND/app/models/`|SQLAlchemy ORM osztályok|
|API végpontok|`BACKEND/app/blueprints/`|Modulokra bontott route-ok|
|Frontend helye|`FRONTEND/`|A későbbi kliensoldali kód helye|
|Dokumentáció|`DOCUMENTATION/`|A projekt bemutató dokumentumai|
|VS Code workspace|`BerAuto.code-workspace`|A három fő mappa együttes megnyitása|

## 

## 

## 

## Alap futtatási út

```powershell
cd BACKEND
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python init\_db.py
python run\_app.py
```

Swagger:

```text
http://localhost:8888/swagger
```

## 

## 

## 

## Teszt felhasználók

|Szerep|E-mail|Jelszó|Használat|
|-|-|-|-|
|Admin|admin@berauto.hu|admin123|Admin oldalak, autókezelés, napló.|
|Ügyintéző|ugyintezo@berauto.hu|ugyintezo123|Ügyintézői oldalak, kölcsönzések kezelése.|
|Felhasználó|teszt@berauto.hu|teszt123|Felhasználói oldalak, saját kölcsönzések.|











