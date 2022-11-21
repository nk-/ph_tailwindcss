### Ph* TailwindCSS Drupal 10 theme.
See it in action here: https://ph-playground.store
A front page there is the actual documentation for it.

#### Wanna try?
Note, this is rather a _proof-of-concept_ and originally not intended for a general usage,
as a contributed Drupal theme. However, it may serve as a starter kit
or ideas and solutions source.

##### On the fresh Drupal site?
- Clone this repository and then run:
`composer install`
`drush en ph_core`
`drush config-set system.theme default ph_tailwindcss`

##### On the existing Drupal site?
- Clone this repository and take _Ph* core_ module and _Ph* Tailwind CSS_ theme
and place in appropriate directories.
`drush en ph_core`
`drush config-set system.theme default ph_tailwindcss`

Start playing, either with Twig templates or with Tailwind's Post CSS file found
in src folder within theme.
To build distribution CSS file run: `npm run build` from within theme's folder.
