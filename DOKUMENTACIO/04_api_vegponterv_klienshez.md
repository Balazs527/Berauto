# API végpontterv a kliensoldalhoz

Ez a dokumentum a `BACKEND/app/blueprints/` mappa alapján mutatja be a backend végpontokat. A kliensoldal fejlesztésénél ezt érdemes használni alapként.

## 

## Alapelvek

|Elv|Magyarázat|
|-|-|
|Az oldalak nem közvetlenül adatbázist kezelnek|A kliens csak API-n keresztül kommunikál a backenddel.|
|A védett végpontok Bearer tokent várnak|Bejelentkezés után a kapott tokent az `Authorization: Bearer <token>` fejlécben kell küldeni.|
|A szerepkörök a tokenben vannak|A frontend ezek alapján mutathatja vagy rejtheti a User / Clerk / Admin menüpontokat.|
|A service réteg külön legyen a frontendben|Az oldalak ne közvetlenül `fetch`/HTTP hívást tartalmazzanak, hanem service függvényeket használjanak.|
|A Swagger az ellenőrzéshez használható|Fejlesztés közben minden végpont kipróbálható: `http://localhost:8888/swagger`.|

## 

## Végpontok részletes táblázata

|Modul|HTTP|Végpont|Jogosultság|Kliensből küldött adat|Válasz|Kliens oldal|Indoklás|
|-|-|-|-|-|-|-|-|
|Alap|GET|/api/|Publikus|Nincs|message|API ellenőrző oldal|Gyorsan ellenőrizhető, hogy fut-e a backend.|
|Autók|GET|/api/car/available|Publikus|Nincs|CarSchema\[]|Főoldali autólista|A látogatók bejelentkezés nélkül láthatják a kölcsönözhető, aktív autókat.|
|Autók|GET|/api/car/{cid}|Publikus|cid URL paraméter|CarSchema|Autó részletek|A listából kiválasztott autó külön adatlapot kap.|
|Vendég kölcsönzés|POST|/api/rental/request|Publikus|car\_id, start\_date, end\_date, customer|RentalResponseSchema|Vendég igény űrlap|Regisztráció nélkül is leadható kölcsönzési igény.|
|Felhasználó|POST|/api/user/registrate|Publikus|name, email, password, phone, address|UserResponseSchema|Regisztráció oldal|Új user létrehozása, alap User szerepkörrel.|
|Felhasználó|POST|/api/user/login|Publikus|email, password|UserResponseSchema + token|Bejelentkezés|A token alapján működnek a védett oldalak.|
|Felhasználó|GET|/api/user/profile|User/Clerk/Admin|Bearer token|UserResponseSchema|Profil oldal|A saját user adat a tokenből azonosítható.|
|Felhasználó|PUT|/api/user/profile|User/Clerk/Admin|phone, address|UserResponseSchema|Profil módosítás|Kapcsolati adatok frissítése.|
|Felhasználó|GET|/api/user/rentals|User|Bearer token|RentalResponseSchema\[]|Saját kölcsönzések|A user csak saját kölcsönzéseit kapja vissza.|
|Felhasználó|POST|/api/user/rentals/request|User|car\_id, start\_date, end\_date|RentalResponseSchema|Regisztrált igény|A user\_id a tokenből jön, nem kell külön küldeni.|
|Ügyintéző|GET|/api/clerk/rentals/requests|Clerk/Admin|Bearer token|RentalResponseSchema\[]|Beérkezett igények|Az ügyintéző az új requested állapotú igényeket látja.|
|Ügyintéző|GET|/api/clerk/rentals/running|Clerk/Admin|Bearer token|RentalResponseSchema\[]|Futó kölcsönzések|Accepted és handed\_over állapotok kezelése.|
|Ügyintéző|GET|/api/clerk/rentals/expired|Clerk/Admin|Bearer token|RentalResponseSchema\[]|Lejárt kölcsönzések|Lejárt vagy visszahozott kölcsönzések utánkövetése.|
|Ügyintéző|POST|/api/clerk/rentals/{rid}/accept|Clerk/Admin|rid URL paraméter|RentalResponseSchema|Elfogadás gomb|Állapot requested -> accepted.|
|Ügyintéző|POST|/api/clerk/rentals/{rid}/handover|Clerk/Admin|start\_odometer|RentalResponseSchema|Átadás űrlap|Km rögzítés, autó elérhetetlenné tétele.|
|Ügyintéző|POST|/api/clerk/rentals/{rid}/return|Clerk/Admin|end\_odometer|RentalResponseSchema|Visszavétel űrlap|Km zárás, autó újra elérhetővé tétele.|
|Ügyintéző|POST|/api/clerk/rentals/{rid}/invoice|Clerk/Admin|rid URL paraméter|InvoiceSchema|Számla oldal|Returned kölcsönzésből számla készül.|
|Admin|GET|/api/admin/cars|Admin|Bearer token|CarSchema\[]|Admin autólista|Admin minden autót lát, nem csak a publikusakat.|
|Admin|POST|/api/admin/cars|Admin|CarRequestSchema|CarSchema|Új autó|Új autó rekord létrehozása.|
|Admin|PUT|/api/admin/cars/{cid}|Admin|CarUpdateSchema|CarSchema|Autó szerkesztés|Meglévő autó adatainak módosítása.|
|Admin|DELETE|/api/admin/cars/{cid}|Admin|cid URL paraméter|CarSchema|Autó inaktiválás|Logikai törlés, előzmények megmaradnak.|
|Admin|PATCH|/api/admin/cars/{cid}/odometer|Admin|odometer|CarSchema|Km óra módosítás|Csak egy részmező változik, csökkenő km értéket a backend tilt.|
|Admin/Ügyintéző|PATCH|/api/admin/cars/{cid}/availability|Admin/Clerk|available|CarSchema|Elérhetőség kapcsoló|Napi üzemeltetéshez gyors állapotváltás.|
|Admin|GET|/api/admin/logs|Admin|Bearer token|LogSchema\[]|Napló oldal|Audit és hibakeresés.|

## 

## Sémák és kliensoldali használat

|Séma|Tartalom|Hol kell a kliensben?|Miért szükséges?|
|-|-|-|-|
|CarSchema|id, license\_plate, brand, model, category, year, daily\_price, odometer, available, active, description|Autólista, autó részletek, admin autókezelés|Egységesen ugyanazt az autóstruktúrát adja vissza.|
|CarRequestSchema|license\_plate, brand, model, category, year, daily\_price, odometer, available, active, description|Admin új autó oldal|Új autóhoz minden kötelező üzleti adatot bekér.|
|CarUpdateSchema|Autó módosítható adatai opcionálisan|Admin szerkesztés|Csak a módosított mezőket kell küldeni.|
|OdometerSchema|odometer|Km óra módosítás|Külön művelet, mert üzletileg érzékeny adat.|
|AvailabilitySchema|available|Elérhetőség kapcsoló|Gyors részleges állapotmódosítás.|
|AddressSchema|id, city, street, postalcode|Regisztráció, profil, vendég kölcsönzés|Külön objektum, mert user és customer is használja.|
|CustomerSchema|id, name, email, phone, address|Vendég kölcsönzés válaszai|Vendég ügyfél adatait külön objektumban adja vissza.|
|UserRequestSchema|name, email, password, phone, address|Regisztráció|Fiók létrehozásához szükséges adatok.|
|UserLoginSchema|email, password|Bejelentkezés|Loginhoz csak az azonosító és jelszó kell.|
|UserUpdateSchema|phone, address|Profil módosítás|A user saját adatai közül ezek módosíthatók.|
|UserResponseSchema|id, name, email, phone, address, roles, token|Login, profil, regisztráció|A kliens ebből építi fel az auth állapotot és a menüt.|
|RentalRequestSchema|car\_id, start\_date, end\_date|Regisztrált igény|User adat a tokenből jön.|
|PublicRentalRequestSchema|car\_id, start\_date, end\_date, customer|Vendég igény|Vendég esetben nincs token, ezért customer is kell.|
|RentalResponseSchema|id, car, user\_id, customer, start\_date, end\_date, status, request\_time, accepted\_at, handover\_at, returned\_at, start\_odometer, end\_odometer, total\_price|Kölcsönzési listák és műveletek|A kliens ebből látja a kölcsönzés állapotát.|
|HandoverSchema|start\_odometer|Átadás|Kezdő km rögzítése.|
|ReturnSchema|end\_odometer|Visszavétel|Záró km rögzítése.|
|InvoiceSchema|id, rental\_id, invoice\_number, issue\_date, net\_amount, tax\_amount, gross\_amount, paid|Számla oldal|Számla külön üzleti objektum.|
|LogSchema|id, user\_id, action, entity, entity\_id, created\_at|Admin napló|Audit és hibakeresés.|

## 

## Javasolt API service fájlok a frontendben

|Frontend service|Helye|Backend modulok|Feladat|
|-|-|-|-|
|`auth.service.js`|`FRONTEND/src/services/`|`/api/user/login`, `/api/user/registrate`|Bejelentkezés, regisztráció, token mentés/törlés|
|`user.service.js`|`FRONTEND/src/services/`|`/api/user/profile`, `/api/user/rentals`|Profil és saját kölcsönzések kezelése|
|`car.service.js`|`FRONTEND/src/services/`|`/api/car`, `/api/admin/cars`|Publikus autólista és admin autókezelés|
|`rental.service.js`|`FRONTEND/src/services/`|`/api/rental`, `/api/user/rentals`|Vendég és regisztrált kölcsönzési igény|
|`clerk.service.js`|`FRONTEND/src/services/`|`/api/clerk`|Ügyintézői folyamatok|
|`admin.service.js`|`FRONTEND/src/services/`|`/api/admin`|Admin funkciók és napló|
|`apiClient.js`|`FRONTEND/src/services/`|összes|Közös base URL, JSON kezelés, Bearer token csatolás|



