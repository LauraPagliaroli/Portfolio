# Portfolio · Laura Pagliaroli, UX Researcher & Product Discovery

Site statique (HTML, CSS, JavaScript sans dépendance), prêt pour GitHub Pages.

## Structure

```
index.html                         Accueil (EN, bouton FR / IT)
case-studies/
  picard-product-tiles-loyalty.html   Étude de cas modèle (Picard)
  signalconso-dgccrf.html             SignalConso (contenu repris de Notion)
  savoirsphere-teacher-app.html       SavoirSphère (Notion)
  guide-master-travel-app.html        Guide Master (Notion)
  dnum-product-studio.html            DNUM : BROUILLON CACHÉ (voir plus bas)
assets/
  styles.css      Toutes les couleurs et typos sont des variables en haut du fichier (:root)
  i18n.js         Traductions FR et IT de l'accueil (l'anglais est dans le HTML)
  main.js         Changement de langue, bouton mode clair / sombre (chaque page s'ouvre en clair), menu mobile, copie de l'email
  og-image.png    Image de partage LinkedIn (1200 × 630)
  laura-pagliaroli*.webp              Portrait
  Laura_Pagliaroli_CV_UX_Researcher_EN.pdf
robots.txt, sitemap.xml, .nojekyll
```

## À faire avant la mise en ligne

1. **Adresse du site** : https://laurapagliaroli.github.io/Portfolio/ (déjà renseignée dans les balises SEO,
   sitemap.xml et robots.txt ; à changer partout si tu passes à ton propre nom de domaine).
2. **Contenus à compléter** : chercher `todo` ou `À REMPLACER` dans les fichiers. Chaque bloc à compléter
   s'affiche en rose avec la mention [À REMPLACER] sur le site.
3. **Images des études de cas** : les images Notion n'ont pas pu être téléchargées automatiquement.
   Exporte-les depuis Notion (clic droit > Télécharger), convertis-les en WebP, place-les dans `assets/`
   avec le nom indiqué dans chaque emplacement, puis remplace le SVG d'attente par la balise `<img>` fournie
   en commentaire juste au-dessus.

## Publier l'étude DNUM (actuellement cachée)

La page existe mais elle n'est ni liée depuis l'accueil, ni indexée par Google, ni dans le sitemap.
Pour la publier :
1. Dans `case-studies/dnum-product-studio.html` : supprimer la ligne `<meta name="robots" content="noindex, nofollow">`
   et le bandeau « Hidden draft », ajouter une balise canonical comme sur les autres pages.
2. Dans `index.html` : retirer le commentaire `<!-- HIDDEN DRAFT · DNUM … -->` qui entoure la carte,
   remplacer `label–coral` par `label--coral`, et entourer le titre d'un lien vers la page.
   La carte doit rester en premier (projet le plus récent).
3. Ajouter l'URL dans `sitemap.xml`.

## Modifier les couleurs ou les typos

Ouvre `assets/styles.css` : le bloc `:root` en haut définit `--washi` (fond), `--navy` (couleur primaire),
`--coral` (secondaire), etc. Le mode sombre est redéfini juste en dessous.
Typos : Sora pour tout le site (nom en extra bold 800, titres en bold 700), IBM Plex Mono pour les étiquettes.

## Mise en ligne sur GitHub Pages

1. Crée un dépôt public nommé `ton-nom-utilisateur.github.io`.
2. Dépose tout le contenu de ce dossier à la racine du dépôt.
3. Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
4. Le site est en ligne à `https://ton-nom-utilisateur.github.io/` après une ou deux minutes.
5. Déclare l'adresse dans Google Search Console et soumets `sitemap.xml`.
