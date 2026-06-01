# NIKA HOTEL — Base Premium

Base solide pour un site hôtel ultra premium : frontend Next.js prêt Vercel + backend Node/Express prêt Render + structure Prisma/PostgreSQL.

## Lancement frontend
```bash
cd frontend
npm install
npm run dev
```
Ouvrir : http://localhost:3000

## Lancement backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
API : http://localhost:5000/api/health

## Déploiement dès le début

### Vercel — frontend
- Importer le dossier `frontend`
- Framework : Next.js
- Build command : `npm run build`
- Output : automatique
- Variable : `NEXT_PUBLIC_API_URL=https://ton-backend-render.onrender.com`

### Render — backend
- Root directory : `backend`
- Build command : `npm install && npm run build`
- Start command : `npm start`
- Variables : voir `backend/.env.example`

## Modules prévus
- Site public premium
- Chambres
- Restaurant
- Bar
- Galerie
- Réservation
- Dashboard admin futur
- Backend API prêt pour réservations, chambres, restaurant, clients, paiement
