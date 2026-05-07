# BérAutó Frontend

A BérAutó projekt frontend alkalmazása **React + Vite** használatával készült. Ez egy autókölcsönzési rendszer felhasználói felülete, amely támogatja a vendégek, regisztrált felhasználók, ügyintézők és adminisztrátorok eltérő funkcionalitásait.

## Indítás

```bash
cd FRONTEND
npm install
npm run dev
```

Az alkalmazás a `http://localhost:5173` címen lesz elérhető.

## Környezeti változók

```
VITE_API_URL=http://localhost:8888
```

A backend API alapértelmezés szerint a `http://localhost:8888` porton fut.

---

## Projekt Szerkezete

```
src/
├── pages/              # Oldal komponensek (PageComponent pattern)
├── components/         # Újrafelhasználható UI komponensek
├── services/           # API kommunikáció és logika
├── utils/              # Segédfüggvények (pl. szerepkörkezelés)
├── App.jsx             # Főalkalmazás, routing
├── main.jsx            # Alkalmazás belépési pont
├── App.css             # Globális stílusok
└── index.css           # Alapvető CSS
```

---

## Oldalak és Funkcionalitások

### 1. **HomePage** (`/`)
- **Felhasználók**: Vendég, User, Clerk, Admin
- **Funkciók**: 
  - Bevezetés és üdvözlés
  - Az elérhető autók száma
  - Linkek a regisztrációhoz és bejelentkezéshez
- **API hívások**: Nincsenek

### 2. **CarListPage** (`/cars`)
- **Felhasználók**: Összes (publikus oldal)
- **Funkciók**:
  - Az összes elérhető autó listázása
  - Autó kártya megjelenítése brand, modell, napi áral
  - Autóra kattintva a részletekhez
- **API hívások**: 
  - `GET /api/car/available` - elérhető autók lekérése
  - `GET /api/car/{cid}` - autó részletei
- **Komponens**: `CarCard.jsx` - az autó információk megjelenítésére

### 3. **GuestRentalPage** (`/rental-request`)
- **Felhasználók**: Vendég (nincs bejelentkezés szükséges)
- **Funkciók**:
  - Autó kiválasztása
  - Kölcsönzési időszak megadása (kezdő és záró dátum)
  - Ügyfél adatok kitöltése (név, email, telefon, cím)
- **API hívások**:
  - `POST /api/rental/request` - vendég kölcsönzési igény elküldése
- **Megjegyzés**: Nem szükséges regisztráció

### 4. **LoginPage** (`/login`)
- **Felhasználók**: Vendég
- **Funkciók**:
  - Email és jelszó bejelentkezés
  - Bejelentkezés után automatikus átirányítás a saját dashboarda
  - Regisztrációs link
- **API hívások**:
  - `POST /api/user/login` - bejelentkezés és token beszerzés
  - Válasz tartalmazza: `token`, `roles`, `user` adatok
- **Service**: `authService.login()`

### 5. **RegisterPage** (`/register`)
- **Felhasználók**: Vendég
- **Funkciók**:
  - Új felhasználó regisztrációja
  - Mezők: név, email, jelszó, telefon, cím
  - Sikeres regisztráció után automatikus bejelentkezés
- **API hívások**:
  - `POST /api/user/registrate` - új felhasználó létrehozása
  - Automatikus bejelentkezés után
- **Service**: `authService.register()`

### 6. **ProfilePage** (`/profile`)
- **Felhasználók**: User, Clerk, Admin (védett)
- **Funkciók**:
  - Felhasználó adatok megjelenítése (név, email, telefon, cím)
  - Kapcsolati adatok módosítása (telefon, cím)
  - Profil adatok frissítése
- **API hívások**:
  - `GET /api/user/profile` - profil adatok lekérése
  - `PUT /api/user/profile` - profil adatok frissítése
- **Service**: `authService.updateProfile()`
- **Komponens**: `ProtectedRoute` - csak bejelentkezett felhasználók

### 7. **MyRentalsPage** (`/my-rentals`)
- **Felhasználók**: User (regisztrált, védett)
- **Funkciók**:
  - A felhasználó saját kölcsönzéseinek listázása
  - Állapotok: requested, accepted, handed_over, returned
  - Kölcsönzés dátumok, árra, autó adatok
- **API hívások**:
  - `GET /api/user/rentals` - saját kölcsönzések lekérése
  - `POST /api/user/rentals/request` - új kölcsönzési igény
- **Service**: `rentalService.getUserRentals()`

### 8. **ClerkDashboardPage** (`/clerk`)
- **Felhasználók**: Clerk, Admin (védett)
- **Funkciók**:
  - Áttekintés az ügyintézői feladatokról
  - Linkek a beérkezett igényekhez, futó kölcsönzésekhez, lejárt kölcsönzésekhez
  - Gyors statisztikák
- **API hívások**: Nincsenek közvetlenül (a kapcsolódó oldalak hívják)
- **Megjegyzés**: Átjáró az ügyintéző funkcionalitásokhoz

### 9. **ClerkCarAvailable** (`/clerk/cars`)
- **Felhasználók**: Clerk, Admin (védett)
- **Funkciók**:
  - Autók elérhetőségi státusza
  - Havi/napi autó elérhetőség kezelése
  - Autó kiválasztása és elérhetőség módosítása
- **API hívások**:
  - `GET /api/admin/cars` - összes autó lekérése
  - `PATCH /api/admin/cars/{cid}/availability` - elérhetőség módosítása
- **Service**: `carService.updateAvailability()`

### 10. **AdminDashboardPage** (`/admin`)
- **Felhasználók**: Admin (védett)
- **Funkciók**:
  - Admin funkciók áttekintése
  - Linkek az autókezeléshez, ügyintézői feladatokhoz, auditáláshoz
  - Rendszer statisztikák
- **API hívások**: Nincsenek közvetlenül
- **Megjegyzés**: Admin kontrol centrum

### 11. **NotFoundPage** (`/*`)
- **Felhasználók**: Összes
- **Funkciók**:
  - 404 oldal nem létező útvonalakhoz
  - Vissza a főoldalra link

---

## Komponensek

### `Navbar.jsx`
- **Funkció**: Felső navigációs sáv
- **Mutatja**:
  - Logo, oldal linkek
  - Bejelentkezett felhasználó neve
  - Szereprőrkör-alapú menüpontok (User, Clerk, Admin)
  - Kijelentkezés gomb
- **Prop**: `auth` - a jelenlegi felhasználó és jogosultságok

### `CarCard.jsx`
- **Funkció**: Autó információk kártyaszerű megjelenítése
- **Mutat**: Brand, modell, év, napi ár, fotó
- **Kihasználat**: `CarListPage`

### `ProtectedRoute.jsx`
- **Funkció**: Útvonal védelem
- **Működés**: Csak bejelentkezett felhasználók férhetnek hozzá bizonyos oldalakhoz
- **Átirányítás**: Bejelentkezés felhasználók a login oldalra

---

## Service Réteg (API Kommunikáció)

### `apiClient.js`
- **Alapvető HTTP kliens** az API hívásokhoz
- **Funkciók**:
  - Base URL beállítása
  - Bearer token automatikus csatolása az `Authorization` fejlécben
  - Error handling
  - JSON adatok kezelése

### `authService.js`
- **Bejelentkezés és regisztráció kezelése**
- **Függvények**:
  - `login(email, password)` - `POST /api/user/login`
  - `register(name, email, password, phone, address)` - `POST /api/user/registrate`
  - `updateProfile(phone, address)` - `PUT /api/user/profile`
  - Token mentése/törlése `localStorage`-ben

### `carService.js`
- **Autók listázása és kezelése**
- **Függvények**:
  - `getAvailableCars()` - `GET /api/car/available` (publikus)
  - `getCarDetail(carId)` - `GET /api/car/{cid}` (publikus)
  - `updateAvailability(carId, available)` - `PATCH /api/admin/cars/{cid}/availability`

### `rentalService.js`
- **Kölcsönzési igények kezelése**
- **Függvények**:
  - `requestRentalAsGuest(carId, startDate, endDate, customer)` - `POST /api/rental/request`
  - `requestRentalAsUser(carId, startDate, endDate)` - `POST /api/user/rentals/request`
  - `getUserRentals()` - `GET /api/user/rentals`

---

## Hitelesítés és Jogosultságok

### Token kezelés
- Az `authService` a Bearer tokent a `localStorage`-ben tárja
- Az `apiClient` automatikusan csatolja a tokent az `Authorization: Bearer <token>` fejlécben

### Szerepkörök
- **Guest**: Vendég, nem bejelentkezett
- **User**: Regisztrált felhasználó
- **Clerk**: Ügyintéző
- **Admin**: Rendszergazda

### `ProtectedRoute`
- Csak bejelentkezett felhasználók férhetnek hozzá
- Kijelentkezetlenek a login oldalra kerülnek

---

## Fejlesztési Workflow

1. **Backend API tesztelése**: `http://localhost:8888/swagger`
2. **Frontend indítása**: `npm run dev`
3. **Service-k használata**: Az oldalak csak a `services/` mappában lévő függvényeket hívják
4. **UI szerkesztés**: `src/pages/` és `src/components/` mappák

---

## Fontos Megjegyzések

- Az alkalmazás a backend API-ra támaszkodik, amely a `VITE_API_URL` alapján érhető el
- Az összes API hívás a `services/` mappában van szervezve
- Az oldalak nem közvetlenül hívják az API-t, hanem a service-kön keresztül
- A bearer token a `localStorage`-ben van tárolva és automatikusan csatolódik
- Az admin és ügyintézői funkciók a role-based access control-on alapulnak