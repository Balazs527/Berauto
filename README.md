# BérAutó projekt

A BérAutó projekt egy Python alapú autókölcsönző backend rendszer, amely APIFlask keretrendszerrel, SQLAlchemy ORM-mel és SQLite adatbázissal készült.  
A projekt több gyökérmappás szerkezetben van felépítve, hogy a backend, a későbbi frontend és a dokumentáció egymástól elkülönítve, mégis egy közös projektként legyen kezelhető.

## 

## 

## Jelenlegi állapot

|Rész|Állapot|Tartalom|
|-|-|-|
|`BACKEND/`|Elkészült|Működő Python API backend, APIFlask, SQLAlchemy ORM, SQLite adatbázis, Swagger felület, tesztfájl|
|`FRONTEND/`|Előkészítve / frissítve|A későbbi kliensoldali alkalmazás mappaszerkezete: `public/`, `src/assets/`, `src/components/`, `src/pages/`, `src/services/`|
|`DOKUMENTACIO/`|Elkészült / frissítve|Projektleírás, mappaszerkezet, adatbázis, API-végpontok, kliensoldali terv, javítási jelentés|
|`BerAuto.code-workspace`|Elkészült / frissítve|Visual Studio Code multi-root workspace a projekt fő mappáinak együttes megnyitásához|

## 

## 

## Projekt mappaszerkezet

```text
BerAutoProject/

├─ BACKEND/
│  ├─ .flaskenv
│  ├─ .vscode/
│  │  └─ launch.json
│  ├─ app/
│  │  ├─ blueprints/
│  │  │  ├─ admin/
│  │  │  │  ├─ \_\_init\_\_.py
│  │  │  │  ├─ routes.py
│  │  │  │  ├─ schemas.py
│  │  │  │  └─ service.py
│  │  │  ├─ car/
│  │  │  │  ├─ \_\_init\_\_.py
│  │  │  │  ├─ routes.py
│  │  │  │  ├─ schemas.py
│  │  │  │  └─ service.py
│  │  │  ├─ clerk/
│  │  │  │  ├─ \_\_init\_\_.py
│  │  │  │  ├─ routes.py
│  │  │  │  └─ service.py
│  │  │  ├─ rental/
│  │  │  │  ├─ \_\_init\_\_.py
│  │  │  │  ├─ routes.py
│  │  │  │  ├─ schemas.py
│  │  │  │  └─ service.py
│  │  │  ├─ user/
│  │  │  │  ├─ \_\_init\_\_.py
│  │  │  │  ├─ routes.py
│  │  │  │  ├─ schemas.py
│  │  │  │  └─ service.py
│  │  │  └─ \_\_init\_\_.py
│  │  ├─ models/
│  │  │  ├─ \_\_init\_\_.py
│  │  │  ├─ activitylog.py
│  │  │  ├─ address.py
│  │  │  ├─ car.py
│  │  │  ├─ customer.py
│  │  │  ├─ invoice.py
│  │  │  ├─ rental.py
│  │  │  ├─ role.py
│  │  │  ├─ tables.py
│  │  │  └─ user.py
│  │  ├─ \_\_init\_\_.py
│  │  └─ extensions.py
│  ├─ berauto.db
│  ├─ config.py
│  ├─ database.sql
│  ├─ init\_db.py
│  ├─ README.md
│  ├─ requirements.txt
│  ├─ run\_app.py
│  └─ test\_backend.py
├─ FRONTEND/
│  ├─ public/
│  │  └─ .gitkeep
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ .gitkeep
│  │  ├─ components/
│  │  │  └─ .gitkeep
│  │  ├─ pages/
│  │  │  └─ .gitkeep
│  │  └─ services/
│  │     └─ .gitkeep
│  └─ README.md
├─ DOKUMENTACIO/
│  ├─ README.md
│  ├─ 00\_projekt\_attekintes.md
│  ├─ 01\_projekt\_mappaszerkezet.md
│  ├─ 02\_backend\_futtatas\_es\_teszteles.md
│  ├─ 03\_adatbazis\_mezok\_es\_kapcsolatok.md
│  ├─ 04\_api\_vegponterv\_klienshez.md
│  ├─ 05\_frontend\_felepitesi\_terv.md
│  ├─ 06\_osszefoglalo\_tablazat.md
│  ├─ 07\_kodellenorzes\_javitasi\_jelentes.md
│  ├─ projekt\_mappaszerkezet.md
│  ├─ berauto\_adatbazis\_mezok\_kapcsolatok.md
│  ├─ berauto\_kliens\_vegponterv.md
│  ├─ berauto\_api\_kapcsolati\_abra.png
│  ├─ berauto\_mappaszerkezet\_abra.png
│  └─ BerAuto\_dokumentacio\_osszefoglalo02.pdf
├─ BerAuto.code-workspace
└─ README.md
```



## 

## Fő funkciók

|Funkció|Backend rész|Rövid magyarázat|
|-|-|-|
|Regisztráció|`BACKEND/app/blueprints/user/`|Új felhasználó létrehozása alap `User` szerepkörrel|
|Bejelentkezés|`BACKEND/app/blueprints/user/`|E-mail és jelszó alapján tokenes bejelentkezés|
|Profilkezelés|`BACKEND/app/blueprints/user/`|Bejelentkezett felhasználó saját adatainak lekérése és módosítása|
|Autólista|`BACKEND/app/blueprints/car/`|Publikus autólista és autó részletek lekérése|
|Vendég kölcsönzés|`BACKEND/app/blueprints/rental/`|Regisztráció nélküli kölcsönzési igény leadása|
|Saját kölcsönzések|`BACKEND/app/blueprints/user/`|Bejelentkezett felhasználó saját kölcsönzési igényei|
|Ügyintézői folyamat|`BACKEND/app/blueprints/clerk/`|Igények elfogadása, autó átadása, visszavétele, számla készítése|
|Admin autókezelés|`BACKEND/app/blueprints/admin/`|Autók felvitele, módosítása, inaktiválása, km óra és elérhetőség kezelése|
|Naplózás|`BACKEND/app/blueprints/admin/` és `activity\\\_logs`|Fontos műveletek ellenőrzése admin oldalon|

## 

## Backend indítása

A backend futtatása mindig a `BACKEND/` mappából történjen.

```powershell
cd BACKEND
python -m venv .venv
.\\\\.venv\\\\Scripts\\\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python init\_db.py
python run\_app.py
```



A szerver indítása után a Swagger felület itt érhető el:

```text
http://localhost:8888/swagger
```



API ellenőrző végpont:

```text
http://localhost:8888/api/
```



Várt válasz:

```json
{
  "message": "BérAutó API"
}
```

## 

## Backend tesztelése

A teljes backend folyamatellenőrzéshez:

```powershell
cd BACKEND
\\.venv\\Scripts\\Activate.ps1
python test\_backend.py
```

A tesztfájl a főbb folyamatokat ellenőrzi: bejelentkezés, tokenhasználat, kölcsönzés, átfedő foglalás tiltása, ügyintézői elfogadás, átadás, visszavétel, számlázás, admin autófelvitel és duplikált rendszám tiltása.

## 

## Adatbázis

|Fájl / mappa|Szerep|
|-|-|
|`BACKEND/berauto.db`|SQLite adatbázis|
|`BACKEND/database.sql`|SQL séma áttekintéshez|
|`BACKEND/init\_db.py`|Adatbázis újragenerálása és kezdő adatok betöltése|
|`BACKEND/app/models/`|SQLAlchemy ORM modellek|



Az adatbázis újragenerálása:

```powershell
cd BACKEND
\\.venv\\Scripts\\Activate.ps1
python init\_db.py
```

## 

## Fontosabb adatbázistáblák

|Tábla|Szerep|
|-|-|
|`addresses`|Felhasználók és vendég ügyfelek címei|
|`roles`|Szerepkörök: User, Clerk, Admin|
|`users`|Regisztrált felhasználók, ügyintézők, adminok|
|`userroles`|Felhasználók és szerepkörök kapcsolótáblája|
|`customers`|Regisztráció nélküli ügyfelek|
|`cars`|Autók adatai|
|`rentals`|Kölcsönzési igények és folyamatok|
|`invoices`|Kölcsönzésekhez tartozó számlák|
|`activity\\\_logs`|Rendszerműveletek naplózása|

## 

## Teszt felhasználók

|Szerep|E-mail|Jelszó|Használat|
|-|-|-|-|
|Admin|`admin@berauto.hu`|`admin123`|Admin oldalak, autókezelés, napló|
|Ügyintéző|`ugyintezo@berauto.hu`|`ugyintezo123`|Igények kezelése, átadás, visszavétel, számlázás|
|Felhasználó|`teszt@berauto.hu`|`teszt123`|Saját profil és saját kölcsönzések|

## 

## Fontos API végpontok

|Modul|Végpont|Szerep|
|-|-|-|
|Alap|`GET /api/`|API futásának ellenőrzése|
|Autók|`GET /api/car/available`|Publikus kölcsönözhető autólista|
|Autók|`GET /api/car/{cid}`|Egy autó részletes adatai|
|Vendég kölcsönzés|`POST /api/rental/request`|Regisztráció nélküli kölcsönzési igény|
|Felhasználó|`POST /api/user/registrate`|Regisztráció|
|Felhasználó|`POST /api/user/login`|Bejelentkezés|
|Felhasználó|`GET /api/user/profile`|Saját profil lekérése|
|Felhasználó|`GET /api/user/me`|Token alapján azonosítja a bejelentkezett felhasználót|
|Felhasználó|`PUT /api/user/profile`|Saját profil módosítása|
|Felhasználó|`GET /api/user/rentals`|Saját kölcsönzések|
|Felhasználó|`POST /api/user/rentals/request`|Regisztrált kölcsönzési igény|
|Ügyintéző|`GET /api/clerk/rentals/requests`|Beérkezett igények|
|Ügyintéző|`GET /api/clerk/cars`|Összes autó ügyintéző listája|
|Ügyintéző|`GET /api/clerk/rentals/running`|Futó kölcsönzések|
|Ügyintéző|`GET /api/clerk/rentals/expired`|Lejárt kölcsönzések|
|Ügyintéző|`POST /api/clerk/rentals/{rid}/accept`|Igény elfogadása|
|Ügyintéző|`POST /api/clerk/rentals/{rid}/handover`|Autó átadása|
|Ügyintéző|`POST /api/clerk/rentals/{rid}/return`|Autó visszavétele|
|Ügyintéző|`POST /api/clerk/rentals/{rid}/invoice`|Számla létrehozása|
|Admin|`GET /api/admin/cars`|Összes autó admin listája|
|Admin|`POST /api/admin/cars`|Új autó felvitele|
|Admin|`PUT /api/admin/cars/{cid}`|Autó módosítása|
|Admin|`DELETE /api/admin/cars/{cid}`|Autó inaktiválása|
|Admin|`PATCH /api/admin/cars/{cid}/odometer`|Km óra módosítása|
|Admin / Ügyintéző|`PATCH /api/admin/cars/{cid}/availability`|Autó elérhetőségének módosítása|
|Admin|`GET /api/admin/logs`|Naplóbejegyzések lekérése|

## 

## Frontend mappa

A `FRONTEND/` mappa jelenleg előkészített hely. A későbbi kliensoldali alkalmazásnál javasolt felosztás:

|Mappa|Szerep|
|-|-|
|`FRONTEND/public/`|Statikus publikus fájlok|
|`FRONTEND/src/assets/`|Képek, ikonok, egyéb statikus elemek|
|`FRONTEND/src/components/`|Újrahasznosítható komponensek|
|`FRONTEND/src/pages/`|Oldalak / nézetek|
|`FRONTEND/src/services/`|Backend API-hívásokat kezelő service fájlok|

## 

## Frontend indítása

A frontend alkalmazás külön Vite + React projekt.

```bash
cd FRONTEND
npm install
npm run dev


## Dokumentáció

A részletes dokumentáció a `DOKUMENTACIO/` mappában található.

Ajánlott kezdőfájl:

```text
DOKUMENTACIO/README.md
```

## 

## Tech stack

- Backend: Flask (Python)
- ORM: SQLAlchemy
- API: APIFlask (REST API)
- Database: SQLite
- Frontend: React + Vite
- HTTP kommunikáció: Fetch API
- Auth: JWT / token alapú hitelesítés

## Visual Studio Code használat

A projekt gyökerében található:

```text
BerAuto.code-workspace
```



Ezzel a teljes projekt egyben megnyitható, miközben a fő részek külön gyökérként kezelhetők:

```text
BACKEND/
FRONTEND/
DOKUMENTACIO/
```

## 

## Megjegyzések

|Téma|Megjegyzés|
|-|-|
|Virtuális környezet|A `.venv` lokális fejlesztői környezet, szükség esetén újragenerálható.|
|`\_\_pycache\_\_`|Python által generált gyorsítótár, nem forráskód.|
|SQLite adatbázis|A `BACKEND/init\_db.py` futtatásával újragenerálható.|
|Dokumentációs mappa neve|A projektben a dokumentációs mappa neve egységesen `DOKUMENTACIO/`.|






