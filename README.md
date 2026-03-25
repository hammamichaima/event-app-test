# Event App — Test Technique Fullstack

## Structure du projet
```
event-app-test/
├── web/        → Interface web + API REST (Next.js)
└── mobile/     → Application mobile (React Native + Expo)
```

---

## Prérequis
- Node.js 18+
- npm
- Expo Go installé sur ton téléphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Un compte [Neon](https://neon.tech) pour la base de données

---

## Partie Web (Next.js)

### Installation
```bash
cd web
npm install
```

### Configuration
Crée un fichier `.env.local` à la racine de `/web` :
```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
JWT_SECRET=monsecretjwt123
```

### Lancer le projet
```bash
npm run dev
```
→ Ouvre [http://localhost:3000](http://localhost:3000)

### Fonctionnalités
- Afficher la liste des événements
- Ajouter un événement via un formulaire
- Supprimer un événement
- Consulter les clients inscrits à un événement

---

## Partie Mobile (React Native + Expo)

### Installation
```bash
cd mobile
npm install
```

### Configuration
Dans `constants/api.js`, remplace l'IP par ton IP locale :
```js
export const API_URL = 'http://TON_IP_LOCAL:3000/api';
```
> Pour trouver ton IP : lance `ipconfig` (Windows) et cherche **IPv4**

- **Émulateur Android** : l'URL `http://10.0.2.2:3000/api` est déjà configurée
- **Téléphone physique** : remplace `192.168.1.42` par ton IP locale (`ipconfig` sur Windows)
- **iOS Simulator** : remplace par `http://localhost:3000/api`

### Lancer le projet
```bash
npx expo start
```
→ Scanne le QR code avec **Expo Go** sur ton téléphone

### Fonctionnalités
- Afficher la liste des événements
- Consulter le détail d'un événement
- Créer un compte (Signup)
- Se connecter (Signin)
- S'inscrire à un événement

---

## Technologies utilisées
- **Backend / Web** : Next.js, PostgreSQL (Neon), bcryptjs, jsonwebtoken
- **Mobile** : React Native, Expo, Expo Router
