# Frontend felépítési terv

A `FRONTEND/` mappa jelenleg előkészített hely. A kliensoldal fejlesztését úgy érdemes elkezdeni, hogy az oldalak, komponensek és API service-ek külön rétegben legyenek.

## 

## Javasolt mappaszerkezet

```text
FRONTEND/
├─ public/
└─ src/
   ├─ assets/
   ├─ components/
   ├─ pages/
   └─ services/
```

## 

## Tervezett oldalak és backend kapcsolatok

|Kliens útvonal|Oldal|Frontend service|Backend végpont|Jogosultság|Indoklás|
|-|-|-|-|-|-|
|/|Autólista|CarService.listAvailable()|GET /api/car/available|Publikus|A rendszer nyitó funkciója az autók böngészése.|
|/cars/:id|Autó részletek|CarService.getById(id)|GET /api/car/{cid}|Publikus|Egy autó részletes megjelenítése és igényindítás.|
|/register|Regisztráció|AuthService.register(data)|POST /api/user/registrate|Vendég|Új felhasználói fiók létrehozása.|
|/login|Bejelentkezés|AuthService.login(data)|POST /api/user/login|Vendég|Token és szerepkörök eltárolása.|
|/rental/request|Vendég kölcsönzés|RentalService.publicRequest(data)|POST /api/rental/request|Vendég|Regisztráció nélküli igény leadása.|
|/profile|Profil|UserService.getProfile()|GET /api/user/profile|User/Clerk/Admin|Saját adatok megtekintése.|
|/profile/edit|Profil módosítás|UserService.updateProfile(data)|PUT /api/user/profile|User/Clerk/Admin|Saját elérhetőségi adatok módosítása.|
|/my-rentals|Saját kölcsönzések|UserService.getRentals()|GET /api/user/rentals|User|A user saját igényeinek és előzményeinek listája.|
|/rentals/new|Regisztrált igény|RentalService.userRequest(data)|POST /api/user/rentals/request|User|Tokenből azonosított userhez kapcsolódik.|
|/clerk/requests|Beérkezett igények|ClerkService.listRequests()|GET /api/clerk/rentals/requests|Clerk/Admin|Ügyintézői feldolgozás kezdő oldala.|
|/clerk/running|Futó kölcsönzések|ClerkService.listRunning()|GET /api/clerk/rentals/running|Clerk/Admin|Átadás/visszavétel munkafolyamat.|
|/clerk/expired|Lejárt kölcsönzések|ClerkService.listExpired()|GET /api/clerk/rentals/expired|Clerk/Admin|Ellenőrzés és utánkövetés.|
|/clerk/invoice/:rentalId|Számla|ClerkService.createInvoice(rentalId)|POST /api/clerk/rentals/{rid}/invoice|Clerk/Admin|Visszahozott kölcsönzés számlázása.|
|/admin/cars|Admin autólista|AdminService.listCars()|GET /api/admin/cars|Admin|Teljes autóállomány kezelése.|
|/admin/cars/new|Új autó|AdminService.createCar(data)|POST /api/admin/cars|Admin|Új autó felvitele.|
|/admin/cars/:id/edit|Autó módosítás|AdminService.update/delete/patch()|PUT/DELETE/PATCH /api/admin/cars/...|Admin|Adatfrissítés, km óra és elérhetőség kezelése.|
|/admin/logs|Napló|AdminService.getLogs()|GET /api/admin/logs|Admin|Műveletek ellenőrzése.|

## 

## Javasolt komponensek

|Komponens|Helye|Hol használható?|Feladat|
|-|-|-|-|
|`Navbar`|`FRONTEND/src/components/`|minden oldal|Szerepkör alapján eltérő menüpontok|
|`CarCard`|`FRONTEND/src/components/`|autólista, részletek|Autó rövid adatainak megjelenítése|
|`CarForm`|`FRONTEND/src/components/`|admin új/szerkesztés|Autó adatainak felvitele és módosítása|
|`RentalForm`|`FRONTEND/src/components/`|vendég és user igény|Kölcsönzési dátumok és adatok bekérése|
|`RentalTable`|`FRONTEND/src/components/`|saját kölcsönzések, clerk listák|Kölcsönzési rekordok táblázatos megjelenítése|
|`ProfileForm`|`FRONTEND/src/components/`|profil módosítás|Telefonszám és cím módosítása|
|`InvoiceView`|`FRONTEND/src/components/`|számla oldal|Számla adatainak megjelenítése|
|`ErrorBox`|`FRONTEND/src/components/`|minden API-hívásnál|Hibák egységes megjelenítése|
|`Loading`|`FRONTEND/src/components/`|minden API-hívásnál|Betöltési állapot jelzése|

## 

## Frontend oldalak szerepkör szerint

|Szerepkör|Oldalak|Backend adat|
|-|-|-|
|Vendég|autólista, autó részletek, login, register, vendég igény|publikus autólista, publikus igény|
|User|profil, profil módosítás, saját kölcsönzések, regisztrált igény|token alapján szűrt user adat|
|Clerk|beérkezett igények, futó kölcsönzések, lejárt kölcsönzések, átadás, visszavétel, számla|ügyintézői végpontok|
|Admin|autó admin, új autó, autó szerkesztés, km óra, elérhetőség, napló|admin végpontok|

## 

## Miért ilyen felépítés javasolt?

|Döntés|Indoklás|
|-|-|
|Oldalak külön `pages` mappában|Az útvonalakhoz tartozó képernyők könnyen megtalálhatók.|
|Újrahasznosítható részek `components` alatt|A táblázatok, űrlapok és kártyák több oldalon is használhatók.|
|API hívások `services` alatt|A backend kommunikáció nem keveredik a megjelenítési logikával.|
|Közös `apiClient`|Egy helyen kezelhető a base URL, token és hibakezelés.|
|Szerepkör alapú navigáció|A user, clerk és admin felületek nem keverednek.|
|A frontend nem ér el közvetlen adatbázist|Az adatbázist kizárólag a Python backend kezeli.|









