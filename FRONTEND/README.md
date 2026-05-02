# BérAutó FRONTEND

Ez a mappa a későbbi kliensoldali alkalmazás helye. Jelenleg a backend készült el, ezért a frontend csak előkészített struktúrát tartalmaz.

## Helye a projektben

```text
BerAutoProject/FRONTEND/
```

## Javasolt frontend szerkezet

```text
FRONTEND/
├─ public/
└─ src/
   ├─ assets/
   ├─ components/
   ├─ pages/
   └─ services/
```

## Rétegek

| Mappa | Feladat |
|---|---|
| `src/pages/` | Oldalak: autólista, login, register, profil, ügyintézői és admin felületek |
| `src/components/` | Újrahasznosítható elemek: Navbar, CarCard, RentalTable, CarForm, RentalForm |
| `src/services/` | API hívások: AuthService, CarService, RentalService, ClerkService, AdminService |
| `src/assets/` | Képek, ikonok, statikus fájlok |
| `public/` | Publikus frontend fájlok |

## Backend alap URL

```text
http://localhost:8888
```

## Fontos dokumentáció

| Dokumentum | Mire való? |
|---|---|
| `../DOCUMENTATION/04_api_vegponterv_klienshez.md` | Végpontok és kérés-válasz adatok |
| `../DOCUMENTATION/05_frontend_felepitesi_terv.md` | Frontend oldalak, service-ek és komponensek |
| `../DOCUMENTATION/06_osszefoglalo_tablazat.md` | Rövid áttekintés |
