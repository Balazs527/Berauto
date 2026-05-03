# Kódellenőrzési és javítási jelentés

## 

## Ellenőrzött javítások állapota

|Terület|Eredeti állapot a projektben|Jelenlegi javított állapot|Hibának számított?|
|-|-|-|-|
|API válaszkezelés|A service réteg több helyen `Schema().dump()` eredményt adott vissza, miközben a route-on `@bp.output(...)` is volt.|A service réteg objektumokat vagy objektumlistákat ad vissza. A JSON szerializálást az APIFlask `@output` dekorátora végzi.|Igen. Dátummezőknél tényleges futási hibát okozott.|
|Dátummezős kölcsönzési válaszok|A kölcsönzési válaszban a `start\_date` és `end\_date` először stringgé alakult, majd az `@output` újra Date mezőként próbálta szerializálni.|A service `Rental` objektumot ad vissza, ezért a Date mezőket az APIFlask/Marshmallow egyszer kezeli.|Igen. Tesztben reprodukálható volt.|
|SQLite idegen kulcsok|A `database.sql` tartalmazott `PRAGMA foreign\_keys=ON` sort, de az ORM által nyitott kapcsolatoknál nem volt automatikus bekapcsolás.|Az `app/extensions.py` SQLAlchemy connect eventtel minden SQLite kapcsolatnál bekapcsolja a `PRAGMA foreign\_keys=ON` beállítást.|Igen, mert SQLite kapcsolatfüggően kezeli ezt.|
|Adatbázis-kapcsolatok|A fő FK-k megvoltak, de nem volt külön automatikus kapcsolati integritásellenőrzés a tesztben.|A teszt ellenőrzi a `PRAGMA foreign\_keys` értékét és a `PRAGMA foreign\_key\_check` eredményét.|Részben. A kapcsolatmodell alapvetően jó volt, de a futásidejű FK-kikényszerítés hiányzott.|
|Teljesítmény|Kevés explicit index volt a gyakran szűrt mezőkön.|Indexek kerültek e-mailre, rendszámra, autó aktív/elérhető állapotára, kölcsönzés státuszára, dátumaira, FK mezőire és naplózásra.|Nem feltétlen futási hiba, de hatékonysági hiányosság volt.|
|Admin autókezelés|A létrehozásnál volt rendszámellenőrzés, de módosításnál nem volt teljes. A nulla napi díj átcsúszhatott. Az inaktív autó elérhetővé tehető volt.|Javítva lett a módosításkori duplikált rendszám, a pozitív napi díj, a csökkenő km óra tiltása és az inaktív autó elérhetővé tételének tiltása.|Igen, több üzleti szabály sérülhetett.|
|Tesztelés|A `test\_backend.py` csak azt ellenőrizte, hogy egy autó beszúrható-e.|A teszt végigmegy a login, token, kölcsönzés, átfedés tiltás, elfogadás, átadás, visszavétel, számla, admin autófelvitel, duplikált rendszám, nulla napi díj, km óra és FK ellenőrzés folyamatokon.|Igen, mert a korábbi teszt nem fedte le a lényegi funkciókat.|
|Dokumentációs gyökérmappa|A projektben `DOKUMENTACIO` mappa volt, de több helyen még `régi dokumentációs név` szerepelt.|Minden útvonal és workspace hivatkozás `DOKUMENTACIO` névre lett igazítva.|Igen, VS Code workspace és dokumentációs hivatkozási hiba volt.|

## 

## Futtatott ellenőrzések

|Ellenőrzés|Eredmény|
|-|-|
|Python szintaktikai ellenőrzés|Sikeres|
|`python init\_db.py`|Sikeres|
|`python test\_backend.py`|Sikeres|
|`PRAGMA foreign\_keys`|`1`|
|`PRAGMA foreign\_key\_check`|Üres eredmény, nincs sérült idegen kulcs|
|`régi dokumentációs név` hivatkozások keresése|Nem maradt ilyen hivatkozás|

## 

## 

## 

