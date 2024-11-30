<?php

namespace App\babysitting\Modele\Repository;

use App\babysitting\Modele\DataObject\AbstractDataObject;
use App\babysitting\Modele\DataObject\Utilisateur;

class UtilisateurRepository extends AbstractDataRepository
{
    protected function formatTableauSQL(AbstractDataObject $objet): array
    {
        /** @var Utilisateur $objet */
        return array(
            "loginTag" => $objet->getLogin(),
            "nomTag" => $objet->getNom(),
            "prenomTag" => $objet->getPrenom(),
            "mdpHacheTag" => $objet->getMdpHache()
        );
    }

    protected function getNomColonnes(): array
    {
        return ["login", "nom", "prenom", "mdpHache"];
    }

    public function getNomTable(): string
    {
        return "utilisateur";
    }

    public function getNomClePrimaire(): string
    {
        return "login";
    }

    public function construireDepuisTableauSQL(array $objetFormatTableau): Utilisateur
    {
        return new Utilisateur(
            $objetFormatTableau['login'],
            $objetFormatTableau['nom'],
            $objetFormatTableau['prenom'],
            $objetFormatTableau['mdpHache']
        );
    }


}