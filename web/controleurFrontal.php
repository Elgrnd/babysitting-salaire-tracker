<?php
require_once __DIR__ . '/../src/Lib/Psr4AutoloaderClass.php';

// initialisation en activant l'affichage de débogage
$chargeurDeClasse = new App\babysitting\Lib\Psr4AutoloaderClass(false);
$chargeurDeClasse->register();
// enregistrement d'une association "espace de nom" → "dossier"
$chargeurDeClasse->addNamespace("App\babysitting", __DIR__ . '/../src');
