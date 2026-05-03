# BérAutó BACKEND

Python APIFlask alapú backend SQLite adatbázissal és SQLAlchemy ORM modellekkel.

## 

## Futtatás Visual Studio Code-ban vagy PowerShellből

```powershell
cd BACKEND
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python init\_db.py
python run\_app.py
```



A szerver alapértelmezett címe:

```text
http://localhost:8888
```



Swagger:

```text
http://localhost:8888/swagger
```

## Fontos fájlok

* `run\_app.py` - alkalmazás indítása
* `init\_db.py` - adatbázis újragenerálása kezdő adatokkal
* `database.sql` - adatbázisséma SQL-ben
* `berauto.db` - SQLite adatbázisfájl
* `app/models` - SQLAlchemy modellek
* `app/blueprints` - API végpontok szerepkörök és fő modulok szerint
* `requirements.txt` - Python csomagok

## 

## Teszt felhasználók

* Admin: `admin@berauto.hu` / `admin123`
* Ügyintéző: `ugyintezo@berauto.hu` / `ugyintezo123`
* Felhasználó: `teszt@berauto.hu` / `teszt123`





