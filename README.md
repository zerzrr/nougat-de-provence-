# LE NOUGAT DE PROVENCE

Catalogue de présentation uniquement : aucun prix, panier, paiement ou commande.

## Lancer le site

1. Installer Node.js 20+.
2. Dans le dossier du projet : `npm install`
3. Lancer : `npm start`
4. Ouvrir `http://localhost:3000`
5. Administration : `http://localhost:3000/admin`

Mot de passe initial : `Jimmynougat`

## Mise en ligne

Déployer ce projet sur un hébergeur Node.js avec disque persistant (la base SQLite `nougat.db` doit être conservée).
En production, définir :
- `ADMIN_PASSWORD` avec un mot de passe fort différent du mot de passe de démonstration
- `SESSION_SECRET` avec une longue valeur aléatoire
- `NODE_ENV=production`

## Important

Les recettes, ingrédients et allergènes préremplis sont des textes de démonstration. Ils doivent être remplacés/validés avec les informations officielles de l'entreprise avant publication.
