# Backend futtatási és tesztelési útmutató

A backend a `BACKEND/` mappában található. Minden parancsot a projekt gyökeréből vagy a `BACKEND/` mappából kell értelmezni.

## 

## Első indítás

```powershell
cd BACKEND
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python init\_db.py
python run\_app.py
```

## 

## Újraindítás, ha már létezik a virtuális környezet

```powershell
cd BACKEND
.\\.venv\\Scripts\\Activate.ps1
python run\_app.py
```

## 

## Swagger felület

```text
http://localhost:8888/swagger
```

## 

## API ellenőrző végpont

```text
http://localhost:8888/api/
```

Várt válasz:

```json
{"message": "BérAutó API"}
```

## 

## Adatbázis újragenerálása

```powershell
cd BACKEND
.\\.venv\\Scripts\\Activate.ps1
python init\_db.py
```

Ez törli és újra létrehozza a `BACKEND/berauto.db` adatbázist, majd betölti a kezdő szerepköröket, teszt felhasználókat és autókat.

## 

## Backend tesztek futtatása

```powershell
cd BACKEND
.\\.venv\\Scripts\\Activate.ps1
python test\_backend.py
```

A `test\_backend.py` ellenőrzi többek között a bejelentkezést, tokenhasználatot, kölcsönzést, átfedő foglalás tiltását, ügyintézői elfogadást, átadást, visszavételt, számlakészítést, admin autófelvitelt és a hibás admin műveletek tiltását.

## 

## Teszt felhasználók

|Szerep|E-mail|Jelszó|Mire használható?|
|-|-|-|-|
|Admin|`admin@berauto.hu`|`admin123`|Admin oldalak, autókezelés, napló|
|Ügyintéző|`ugyintezo@berauto.hu`|`ugyintezo123`|Ügyintézői oldalak, kölcsönzések kezelése|
|Felhasználó|`teszt@berauto.hu`|`teszt123`|Felhasználói oldalak, saját kölcsönzések|

## 

## Fontos backend fájlok

|Fájl / mappa|Szerepe|
|-|-|
|`BACKEND/run\_app.py`|A backend indítása|
|`BACKEND/init\_db.py`|Adatbázis inicializálása|
|`BACKEND/test\_backend.py`|Backend működésének ellenőrzése|
|`BACKEND/config.py`|SQLite elérési út és konfiguráció|
|`BACKEND/database.sql`|SQL adatbázisséma|
|`BACKEND/berauto.db`|SQLite adatbázis|
|`BACKEND/app/\_\_init\_\_.py`|APIFlask alkalmazás létrehozása|
|`BACKEND/app/blueprints/`|Végpontok modulonként|
|`BACKEND/app/models/`|ORM modellek|
|`BACKEND/app/extensions.py`|`db`, `auth` és SQLite foreign key beállítás|









