# BérAutó BACKEND

Python APIFlask alapú backend SQLite adatbázissal és SQLAlchemy ORM modellekkel.

## Helye a projektben

```text
BerAutoProject/BACKEND/
```

## Futtatás PowerShellből

```powershell
cd BACKEND
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python init_db.py
python run_app.py
```

## Elérhetőségek

| Felület | URL |
|---|---|
| API alap | `http://localhost:8888/api/` |
| Swagger | `http://localhost:8888/swagger` |
| Publikus autólista | `http://localhost:8888/api/car/available` |

## Fontos fájlok

| Fájl / mappa | Leírás |
|---|---|
| `run_app.py` | Alkalmazás indítása |
| `init_db.py` | Adatbázis újragenerálása kezdő adatokkal |
| `database.sql` | Adatbázisséma SQL-ben |
| `berauto.db` | SQLite adatbázisfájl |
| `config.py` | Backend konfiguráció |
| `app/models/` | SQLAlchemy modellek |
| `app/blueprints/` | API végpontok modulok szerint |
| `requirements.txt` | Python függőségek |

## Teszt felhasználók

| Szerep | E-mail | Jelszó | Használat |
| --- | --- | --- | --- |
| Admin | admin@berauto.hu | admin123 | Admin oldalak, autókezelés, napló. |
| Ügyintéző | ugyintezo@berauto.hu | ugyintezo123 | Ügyintézői oldalak, kölcsönzések kezelése. |
| Felhasználó | teszt@berauto.hu | teszt123 | Felhasználói oldalak, saját kölcsönzések. |

