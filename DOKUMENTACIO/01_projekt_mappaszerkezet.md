# Projekt mappaszerkezet

Minden fő rész külön gyökérmappában van. Ez azért előnyös, mert a backend, a későbbi frontend és a dokumentáció egymástól függetlenül kezelhető, mégis egy projektként nyitható meg.

|Elérési út|Tartalom|Indoklás|
|-|-|-|
|BerAutoProject/|Projekt gyökere|Innen nyitható meg a teljes munka VS Code-ban a `BerAuto.code-workspace` fájllal.|
|BACKEND/|Python APIFlask backend|Itt van a futtatható szerver, az adatbázis, az ORM modellek, a blueprintek, a sémák és a service réteg.|
|BACKEND/app/|Flask alkalmazáscsomag|A `create\_app` által betöltött alkalmazáslogika.|
|BACKEND/app/blueprints/|API modulok|A végpontok témakörök szerint külön vannak választva: `user`, `car`, `rental`, `clerk`, `admin`.|
|BACKEND/app/models/|SQLAlchemy modellek|Az adatbázistáblák Python oldali leképezései.|
|BACKEND/app/extensions.py|Bővítmények|Közös `db` és `auth` objektumok, valamint SQLite foreign key bekapcsolás.|
|BACKEND/config.py|Backend konfiguráció|SQLite adatbázis elérési útja és `SECRET\_KEY`.|
|BACKEND/database.sql|SQL séma|Az adatbázis kézi áttekintéséhez és beadandó dokumentációhoz.|
|BACKEND/berauto.db|SQLite adatbázis|Fejlesztéshez használható lokális adatbázis.|
|BACKEND/init\_db.py|Adatbázis inicializálás|Újragenerálja a táblákat és betölti a kezdő szerepköröket, felhasználókat és autókat.|
|BACKEND/run\_app.py|Szerver indítása|A backend belépési pontja.|
|BACKEND/test\_backend.py|Backend teszt|Végigellenőrzi a fő backend folyamatokat és az adatbázis-kapcsolatokat.|
|BACKEND/requirements.txt|Függőségek|A Python csomagok telepítéséhez.|
|FRONTEND/|Kliensoldal helye|Jelenleg előkészített mappa, később ide kerül a webes kliens.|
|FRONTEND/src/pages/|Frontend oldalak|Autólista, profil, ügyintézői és admin oldalak helye.|
|FRONTEND/src/components/|Közös komponensek|Újrahasznosítható UI elemek helye.|
|FRONTEND/src/services/|API-hívó service-ek|A frontend innen hívja a backend végpontokat.|
|DOKUMENTACIO/|Dokumentáció|Az aktuális projektstruktúrát, adatbázist, végpontokat és kliensoldali tervet bemutató fájlok.|
|BerAuto.code-workspace|VS Code multi-root workspace|Egyszerre nyitja meg a `BACKEND`, `FRONTEND` és `DOKUMENTACIO` mappákat.|
|.gitignore|Kihagyási szabályok|Nem kerülnek csomagolásra a `.venv`, `\_\_pycache\_\_`, `.pyc` és lokális fájlok.|

## 

## Javasolt munkamód Visual Studio Code-ban

1. A projekt gyökerében nyisd meg ezt a fájlt: `BerAuto.code-workspace`.
2. A VS Code bal oldali fájllistájában külön gyökérként fog megjelenni:

   * `BACKEND`
   * `FRONTEND`
   * `DOKUMENTACIO`
3. A backend futtatása mindig a `BACKEND/` mappából történjen.

## 

## Fontos megjegyzés

A `BACKEND/.venv/` és a `\_\_pycache\_\_/` mappák nem dokumentációs vagy forráskód részek. Ezeket újra lehet generálni, ezért nem szükséges forráscsomagként kezelni.









