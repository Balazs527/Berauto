# BérAutó dokumentáció

Ez a mappa a projekt dokumentációját tartalmazza. Minden elérési út az új projektstruktúrát használja:


BerAutoProject/
├─ BACKEND/
├─ FRONTEND/
└─ DOCUMENTATION/


## 

## Dokumentumok

|Fájl|Tartalom|
|-|-|
|`00\_projekt\_attekintes.md`|Teljes projekt áttekintése, fontos utak, teszt felhasználók|
|`01\_projekt\_mappaszerkezet.md`|Gyökérmappák és fontos fájlok magyarázata|
|`02\_backend\_futtatas\_es\_teszteles.md`|Backend indítás, adatbázis inicializálás, Swagger|
|`03\_adatbazis\_mezok\_es\_kapcsolatok.md`|Adatbázismezők, kulcsok és kapcsolatok|
|`04\_api\_vegponterv\_klienshez.md`|Végpontok, kérés-válasz adatok, kliens oldalak|
|`05\_frontend\_felepitesi\_terv.md`|Frontend oldalak, komponensek és service réteg|
|`06\_osszefoglalo\_tablazat.md`|Rövid összefoglaló táblázat minden fő részről|
|`BerAuto\_dokumentacio\_osszefoglalo02.pdf`|Nyomtatható, összefoglaló PDF dokumentáció|
|`berauto\_api\_kapcsolati\_abra.png`|Kliens-backend-adatbázis kapcsolati ábra|
|`berauto\_mappaszerkezet\_abra.png`|Projektmappák áttekintő ábrája|

## 

## 

## Backend indítás röviden

```powershell
cd BACKEND
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
python init\_db.py
python run\_app.py
```





Swagger:

```text
http://localhost:8888/swagger
```







