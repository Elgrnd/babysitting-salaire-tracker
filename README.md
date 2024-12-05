# Gestion Babysitting - PWA

## Description

Ce projet est une application web progressive (PWA) de gestion de babysitting. L'application permet aux utilisateurs d'ajouter leurs informations personnelles, de suivre leurs babysittings passés et d'accéder à un historique de leurs sessions de babysitting, y compris la date, le volume horaire, le salaire par heure et le salaire total.

Le projet utilise **SQL.js** pour stocker les données en local.

### Fonctionnalités

- **Enregistrement des informations de l'utilisateur** : L'utilisateur peut enregistrer son nom et son prénom.
- **Historique des Babysittings** : L'utilisateur peut ajouter des babysittings avec des informations telles que la date, le volume horaire, le salaire par heure et le salaire total.
- **Statistiques des Babysittings** : L'utilisateur verra l'argent gagné en tout, les "primes" qu'il aura reçu de la part de ses clients et le nombre d'heures totales effectuées
- **Stockage Local** : Utilisation de `SQL.js` pour stocker les informations dans une base de données SQLite locale.
- **Progressive Web App (PWA)** : L'application est installable sur son appareil via le navigateur web pour un accès rapide.
- **Mise à jour automatique de l'application** : L'application se met à jour automatiquement dès qu'une nouvelle version est disponible.

## Fonctionnement du projet

### 1. **Service Worker**

Le **Service Worker** permet de mettre en cache les ressources du site pour une utilisation hors ligne. Il gère également les mises à jour de l'application et permet de forcer le rechargement de la page quand une nouvelle version est disponible.

#### Installation du Service Worker

Le service worker est responsable de l'installation des ressources de l'application dans le cache lors de son activation. Il s'assure aussi de gérer les mises à jour et de supprimer les anciens caches lors de l'activation d'une nouvelle version.

### 2. **Base de Données Locale (SQL.js)**

L'application utilise **SQL.js** pour stocker les informations de l'utilisateur et de ses babysittings localement. Cela permet de garder une trace de l'historique des babysittings même lorsque l'utilisateur est hors ligne.

### 3. **Ajouter l'application à l'écran d'accueil**

L'application est une **Progressive Web App (PWA)**, ce qui signifie que vous pouvez l'installer sur votre appareil mobile pour un accès rapide.

#### Sur un appareil mobile (Android / iOS) :
1. Ouvrez l'application dans votre navigateur (Google Chrome ou Safari).
2. Appuyez sur le bouton **"Ajouter à l'écran d'accueil"**.
3. Confirmez l'ajout, et l'icône de l'application sera ajoutée à votre écran d'accueil, tout comme une application native.

## Développement

Pour participer au développement ou faire des ajustements, voici les étapes de base :

1. Clonez ce repository sur votre machine.
2. Modifiez le code dans les fichiers que vous souhaitez pour personnaliser l'application.
3. Testez vos modifications en lançant un serveur local et en ouvrant l'application dans votre navigateur.
4. Poussez vos modifications sur le repository une fois les tests réussis.

## Auteurs

- [Moi-même](https://github.com/Elgrnd)
  
---

Ce fichier `README.md` fournit des informations complètes sur le projet, y compris la manière d'installer l'application en tant que PWA.
