# BérAutó dokumentáció

Ez a mappa a BérAutó projekt dokumentációját tartalmazza. Minden elérési út a jelenlegi projektstruktúrát használja:

```text
BerAutoProject/
├─ BACKEND/
├─ FRONTEND/
└─ DOKUMENTACIO/
```

## 

## Dokumentumok

|Fájl|Tartalom|
|-|-|
|`00\_projekt\_attekintes.md`|Teljes projekt áttekintése, jelenlegi állapot, fontos utak, teszt felhasználók|
|`01\_projekt\_mappaszerkezet.md`|Gyökérmappák és fontos fájlok magyarázata|
|`02\_backend\_futtatas\_es\_teszteles.md`|Backend indítás, adatbázis inicializálás, Swagger, tesztelés|
|`03\_adatbazis\_mezok\_es\_kapcsolatok.md`|Adatbázismezők, kulcsok, megszorítások, indexek és kapcsolatok|
|`04\_api\_vegponterv\_klienshez.md`|Végpontok, kérés-válasz adatok, kliens oldalak|
|`05\_frontend\_felepitesi\_terv.md`|Frontend oldalak, komponensek és service réteg|
|`06\_osszefoglalo\_tablazat.md`|Rövid összefoglaló táblázat minden fő részről|
|`berauto\_api\_kapcsolati\_abra.png`|Kliens-backend-adatbázis kapcsolati ábra|
|`berauto\_mappaszerkezet\_abra.png`|Projektmappák áttekintő ábrája|

## 

## Backend indítás röviden

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



Tesztelés:

```powershell
python test\_backend.py
```

