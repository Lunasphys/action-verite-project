# Action Vérité - Application Mobile

Application mobile pour jouer à Action ou Vérité entre amis.

## Technologies

- **Angular 17** - Framework frontend
- **Ionic 7** - Framework UI mobile  
- **Capacitor 7** - Plateforme native
- **TypeScript** - Langage de programmation

## Installation

```bash
npm install --legacy-peer-deps
```

## Développement Web

Pour lancer l'application en mode développement :

```bash
npm start
```

ou

```bash
npm run ionic:serve
```

L'application sera accessible sur `http://localhost:4200`

## Build

Pour construire l'application :

```bash
ng build
```

Les fichiers compilés seront dans le dossier `www/`

## Build et déploiement Android

### Prérequis
- Android Studio installé
- JDK installé
- Variables d'environnement configurées

### Commande

```bash
# 1. Builder l'application web
ng build

# 2. Synchroniser avec Capacitor
npx cap sync

# 3. Ouvrir dans Android Studio
npx cap open android

# Dans Android Studio : Run > Run 'app'
```

Ou compilez directement un APK :

```bash
cd android
./gradlew assembleDebug
```

Le fichier APK sera généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`

## Build et déploiement iOS (macOS uniquement)

### Prérequis
- macOS avec Xcode installé
- CocoaPods installé

### Commande

```bash
# 1. Builder l'application web
ng build

# 2. Synchroniser avec Capacitor
npx cap sync

# 3. Ouvrir dans Xcode
npx cap open ios

# Dans Xcode : Sélectionner un simulateur ou un device et cliquer sur Run
```

## Structure du projet

```
src/
├── app/
│   ├── models/          # Modèles de données (Player, Card, etc.)
│   ├── pages/           # Pages de l'application
│   │   ├── home/        # Page d'accueil - Ajout des joueurs
│   │   ├── mode/        # Sélection du mode de jeu
│   │   ├── game/        # Page de jeu
│   │   └── gallery/    # Galerie de photos
│   ├── services/        # Services Angular
│   │   ├── cards.service.ts    # Gestion des cartes
│   │   ├── game.service.ts     # Logique de jeu
│   │   └── storage.service.ts   # Stockage local
│   ├── app.component.ts
│   └── app-routing.module.ts
├── theme/
│   └── variables.scss   # Variables de thème
└── index.html
```

## Fonctionnalités

### ✅ Implémenté

- ✅ Page d'accueil avec ajout/suppression de joueurs
- ✅ Stockage local des joueurs (localStorage)
- ✅ Sélection du mode de jeu (Classique, En soirée)
- ✅ Page de jeu avec système de tirage de cartes
- ✅ Règle : après 3 vérités, action obligatoire
- ✅ Timer pour les actions chronométrées
- ✅ Vibration à la fin du timer (Capacitor Haptics)
- ✅ Cartes avec variables dynamiques (Joueur 1, Joueur 2)
- ✅ Filtrage par genre et mode
- ✅ Cartes non répétables par joueur
- ✅ Design vibrant avec gradients (jaune, bleu, magenta)
- ✅ Interface responsive

### ⏳ À implémenter

- ⏳ Photo obligatoire
- ⏳ Galerie de photos
- ⏳ Mode payant (Stripe)
- ⏳ Authentification Firebase
- ⏳ Notifications push
- ⏳ Sessions multi-appareils

## Modes de jeu

- **Mode Classique** : Pour tous les publics
- **Mode En soirée** : Parfait pour animer vos soirées

## Capacitor Plugins utilisés

- `@capacitor/app` - Gestion de l'app
- `@capacitor/haptics` - Vibration et retours haptiques
- `@capacitor/status-bar` - Configuration de la barre de statut

## Synchronisation des changements

Après chaque modification du code web :

```bash
ng build
npx cap sync
```

Cela synchronise automatiquement les fichiers dans les projets natifs.

## Commandes utiles

```bash
# Voir les informations Capacitor
npx cap doctor

# Lister les plateformes
npx cap ls

# Copier les fichiers web
npx cap copy

# Ouvrir Android Studio
npx cap open android

# Ouvrir Xcode (macOS uniquement)
npx cap open ios
```

## Design

L'application utilise une palette de couleurs vibrante :
- **Jaune** (`#FFE100`) - Fond des pages de jeu
- **Bleu** (`#00B0FF`) - Partie "Action" du logo
- **Violet/Magenta** (`#9D2AA7`, `#EC4899`) - Partie "Vérité" et accents
- **Gradient bleu-rose** - Fond des pages d'accueil et de mode

## Auteur

Projet développé pour le mini-projet Action Vérité

## Licence

Private
