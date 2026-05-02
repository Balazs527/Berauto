# Adatbázis mezők és kapcsolatok

A dokumentum a jelenlegi projekt `BACKEND/database.sql` fájlja és a `BACKEND/app/models/` SQLAlchemy modelljei alapján készült.

## 

## 

## 

## Jelölések

|Jelölés|Jelentés|
|-|-|
|PK|Primary Key, elsődleges kulcs|
|FK|Foreign Key, idegen kulcs|
|UNIQUE / AK|Egyedi alternatív kulcs|
|NULL|Opcionális mező|
|NOT NULL|Kötelező mező|

## 

## 

## 

## Mezők részletesen

|Tábla|Mező|Típus|Kulcs / kötöttség|Hivatkozás|Leírás|
|-|-|-|-|-|-|
|addresses|id|INTEGER|PK|-|Címrekord egyedi azonosítója.|
|addresses|city|VARCHAR(80)|NOT NULL|-|Város.|
|addresses|street|VARCHAR(120)|NOT NULL|-|Utca, házszám.|
|addresses|postalcode|INTEGER|NOT NULL|-|Irányítószám.|
|roles|id|INTEGER|PK|-|Szerepkör egyedi azonosítója.|
|roles|name|VARCHAR(30)|UNIQUE|-|Szerepkör neve: User, Clerk, Admin.|
|users|id|INTEGER|PK|-|Regisztrált felhasználó, ügyintéző vagy admin azonosítója.|
|users|name|VARCHAR(80)|NOT NULL|-|Felhasználó neve.|
|users|email|VARCHAR(120)|UNIQUE|-|Bejelentkezési e-mail cím.|
|users|password|VARCHAR(255)|NOT NULL|-|Hash-elt jelszó.|
|users|phone|VARCHAR(30)|NOT NULL|-|Telefonszám.|
|users|address\_id|INTEGER|FK|addresses.id|Felhasználó címe.|
|userroles|user\_id|INTEGER|PK + FK|users.id|Kapcsolótábla: felhasználó oldala.|
|userroles|role\_id|INTEGER|PK + FK|roles.id|Kapcsolótábla: szerepkör oldala.|
|customers|id|INTEGER|PK|-|Nem regisztrált ügyfél azonosítója.|
|customers|name|VARCHAR(80)|NOT NULL|-|Ügyfél neve.|
|customers|email|VARCHAR(120)|NULL|-|Ügyfél e-mail címe.|
|customers|phone|VARCHAR(30)|NOT NULL|-|Ügyfél telefonszáma.|
|customers|address\_id|INTEGER|FK|addresses.id|Ügyfél címe.|
|cars|id|INTEGER|PK|-|Autó azonosítója.|
|cars|license\_plate|VARCHAR(20)|UNIQUE|-|Rendszám.|
|cars|brand|VARCHAR(50)|NOT NULL|-|Márka.|
|cars|model|VARCHAR(50)|NOT NULL|-|Modell.|
|cars|category|VARCHAR(50)|NOT NULL|-|Kategória.|
|cars|year|INTEGER|NOT NULL|-|Gyártási év.|
|cars|daily\_price|FLOAT|NOT NULL|-|Napi bérleti díj.|
|cars|odometer|INTEGER|NOT NULL|-|Kilométeróra állás.|
|cars|available|BOOLEAN|NOT NULL|-|Aktuálisan kölcsönözhető-e.|
|cars|active|BOOLEAN|NOT NULL|-|Aktív-e a rendszerben.|
|cars|description|VARCHAR(255)|NULL|-|Rövid leírás.|
|rentals|id|INTEGER|PK|-|Kölcsönzés azonosítója.|
|rentals|car\_id|INTEGER|FK|cars.id|Kölcsönzött autó.|
|rentals|user\_id|INTEGER|FK, NULL|users.id|Regisztrált kölcsönző.|
|rentals|customer\_id|INTEGER|FK, NULL|customers.id|Vendég ügyfél.|
|rentals|start\_date|DATE|NOT NULL|-|Kölcsönzés kezdete.|
|rentals|end\_date|DATE|NOT NULL|-|Tervezett vége.|
|rentals|status|VARCHAR(30)|NOT NULL|-|requested / accepted / handed\_over / returned.|
|rentals|request\_time|DATETIME|NOT NULL|-|Igény leadásának ideje.|
|rentals|accepted\_at|DATETIME|NULL|-|Elfogadás időpontja.|
|rentals|handover\_at|DATETIME|NULL|-|Autó átadása.|
|rentals|returned\_at|DATETIME|NULL|-|Autó visszavétele.|
|rentals|start\_odometer|INTEGER|NULL|-|Km átadáskor.|
|rentals|end\_odometer|INTEGER|NULL|-|Km visszavételkor.|
|rentals|total\_price|FLOAT|NOT NULL|-|Teljes ár.|
|rentals|clerk\_id|INTEGER|FK, NULL|users.id|Elfogadó/átadó ügyintéző.|
|rentals|return\_clerk\_id|INTEGER|FK, NULL|users.id|Visszavevő ügyintéző.|
|invoices|id|INTEGER|PK|-|Számla azonosítója.|
|invoices|rental\_id|INTEGER|FK + UNIQUE|rentals.id|Egy kölcsönzéshez legfeljebb egy számla.|
|invoices|invoice\_number|VARCHAR(40)|UNIQUE|-|Számlaszám.|
|invoices|issue\_date|DATETIME|NOT NULL|-|Kiállítás ideje.|
|invoices|net\_amount|FLOAT|NOT NULL|-|Nettó összeg.|
|invoices|tax\_amount|FLOAT|NOT NULL|-|Áfa.|
|invoices|gross\_amount|FLOAT|NOT NULL|-|Bruttó összeg.|
|invoices|paid|BOOLEAN|NOT NULL|-|Fizetett-e.|
|activity\_logs|id|INTEGER|PK|-|Naplóbejegyzés azonosítója.|
|activity\_logs|user\_id|INTEGER|FK, NULL|users.id|Műveletet végző felhasználó.|
|activity\_logs|action|VARCHAR(80)|NOT NULL|-|Művelet neve.|
|activity\_logs|entity|VARCHAR(80)|NOT NULL|-|Érintett entitás.|
|activity\_logs|entity\_id|INTEGER|NULL|-|Érintett rekord azonosítója.|
|activity\_logs|created\_at|DATETIME|NOT NULL|-|Naplózás ideje.|



## 

## 

## 

## Kapcsolatok

|Forrástábla|Céltábla|Kardinalitás|Idegen kulcs|Indoklás|
|-|-|-|-|-|
|addresses|users|1:N|users.address\_id|Egy cím több felhasználónál is szerepelhet.|
|addresses|customers|1:N|customers.address\_id|Vendég ügyfelek címei ugyanebben a közös címtáblában vannak.|
|users|roles|N:M|userroles|A több szerepkör kezelése kapcsolótáblával történik.|
|cars|rentals|1:N|rentals.car\_id|Egy autóhoz időben több kölcsönzés tartozhat.|
|users|rentals|1:N|rentals.user\_id|Regisztrált felhasználó több igényt is leadhat.|
|customers|rentals|1:N|rentals.customer\_id|Vendég kölcsönzések külön customer rekordhoz kapcsolódnak.|
|users|rentals|1:N|rentals.clerk\_id|Ügyintéző elfogadhat/kezelhet több kölcsönzést.|
|users|rentals|1:N|rentals.return\_clerk\_id|Visszavételt végző ügyintéző külön tárolódik.|
|rentals|invoices|1:0..1|invoices.rental\_id|A UNIQUE rental\_id miatt egy kölcsönzéshez legfeljebb egy számla tartozik.|
|users|activity\_logs|1:N|activity\_logs.user\_id|A naplóban látszik, melyik felhasználó végzett műveletet.|



## 

## 

## 

## Fontos tervezési döntések

|Döntés|Indoklás|
|-|-|
|A cím külön `addresses` táblába került|Felhasználó és vendég ügyfél is használ címet, ezért közös entitásként kezelhető.|
|A szerepkör külön `roles` tábla|Egy felhasználónak több szerepköre is lehet, ezért nem egyszerű szövegmezőben van.|
|A `userroles` kapcsolótábla összetett kulcsot használ|Ugyanazt a szerepkört ugyanahhoz a felhasználóhoz nem lehet többször hozzárendelni.|
|A vendég ügyfél külön `customers` tábla|Regisztráció nélkül is lehet kölcsönzési igényt leadni.|
|Az autó törlése logikai törlés|Az `active=False` megőrzi a korábbi kölcsönzési előzményeket.|
|A számla `rental\_id` mezője UNIQUE|Egy kölcsönzéshez legfeljebb egy számla tartozhat.|
|A műveletek `activity\_logs` táblába kerülnek|Admin oldalon ellenőrizhető, hogy ki mit módosított.|











