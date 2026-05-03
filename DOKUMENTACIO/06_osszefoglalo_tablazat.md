# Összefoglaló dokumentációs táblázat

Ez a fájl röviden összefoglalja, hogy a projekt fő részei hol találhatók, mire valók, és hogyan kapcsolódnak egymáshoz.

|Rész|Elérési út / végpont|Szerep|Megjegyzés|
|-|-|-|-|
|Projekt gyökér|BerAutoProject/|A teljes beadandó egyben innen kezelhető.|VS Code-ban a `BerAuto.code-workspace` fájllal nyitható.|
|Backend|BACKEND/|Működő Python API szerver.|Futtatás: `cd BACKEND`, majd `python run\_app.py`.|
|Frontend|FRONTEND/|Előkészített kliensoldali mappa.|Ide kerülnek a pages/components/services fájlok.|
|Dokumentáció|DOKUMENTACIO/|A projekt bemutató anyagai.|Minden dokumentum az aktuális elérési utakat használja.|
|Adatbázis|BACKEND/berauto.db|SQLite adatbázis.|`init\_db.py` újragenerálja.|
|Adatbázis séma|BACKEND/database.sql|SQL séma.|Táblák, kulcsok, indexek és CHECK megszorítások áttekintéséhez.|
|Backend teszt|BACKEND/test\_backend.py|Automatikus ellenőrzés.|Login, token, kölcsönzés, számla, admin műveletek és FK check.|
|API dokumentáció|http://localhost:8888/swagger|Swagger felület.|A végpontok kipróbálásához.|
|Publikus API|/api/car, /api/rental, /api/user/login|Vendég/user belépési pontok.|Bejelentkezés nélkül is elérhetők, ahol szükséges.|
|Védett API|/api/user/profile, /api/clerk, /api/admin|Tokenhez és szerepkörhöz kötött végpontok.|Bearer token kell.|
|Admin funkció|/api/admin/cars, /api/admin/logs|Autókezelés és naplózás.|Csak Admin szerepkör.|
|Ügyintéző funkció|/api/clerk/...|Igények, átadás, visszavétel, számla.|Clerk vagy Admin szerepkör.|
|Felhasználói funkció|/api/user/rentals|Saját kölcsönzések.|User szerepkör.|
|Vendég funkció|/api/rental/request|Regisztráció nélküli igény.|customer adatot is küldeni kell.|

## 

## Ajánlott olvasási sorrend

|Sorrend|Fájl|Miért?|
|-|-|-|
|1|`00\_projekt\_attekintes.md`|Általános kép a projektről.|
|2|`01\_projekt\_mappaszerkezet.md`|Új mappastruktúra és utak.|
|3|`02\_backend\_futtatas\_es\_teszteles.md`|Backend indítása, adatbázis inicializálása és tesztelése.|
|4|`03\_adatbazis\_mezok\_es\_kapcsolatok.md`|Adatbázis mezők, kapcsolatok, indexek és megszorítások.|
|5|`04\_api\_vegponterv\_klienshez.md`|Végpontok, kérés/válasz adatok, kliens oldalak.|
|6|`05\_frontend\_felepitesi\_terv.md`|A frontend elkezdéséhez szükséges felépítés.|
|7|`06\_osszefoglalo\_tablazat.md`|Rövid összefoglaló minden fő részről.|









