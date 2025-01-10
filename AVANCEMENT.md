20/12/2024

# Avancement Plantagon

## Structure du projet

La partie web du projet a été dockerisée en deux conteneurs : backend et frontend.
La structure du projet est documentée dans le fichier `README.md` à la racine du projet.

## Backend

Le backend contient également la future base de données sqlite `backend/data/plantagon.db` avec quelques élements pour les tests déjà dans la base.

Les 2 endpoints ont été crées et documentés. Détails de leur fonctionnement `backend/README.md`

Sauf changements à venir le backend est terminé.

## Frontend

La structure du projet frontend est terminée. Les pages et le routing sont en place ainsi que certains composants.
Il reste principalement à ajouter des graphiques pour afficher les données des capteurs. Ainsi que le statut de la plante en elle même.

La communication avec le backend est fonctionnelle. Les données sont récupérées et affichées sur la page.

## Raspberry Pi

Encore en phase de tests des capteurs. Le logiciel est bien installé sur la Raspberry Pi et les capteurs sont fonctionnels.
