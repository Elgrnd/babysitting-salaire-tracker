<?php

namespace App\babysitting\Modele\HTTP;

class Cookie
{
    public static function enregistrer(string $cle, array $valeur, ?int $dureeExpiration = null): void {

        if ($dureeExpiration !== null) {
            setcookie($cle, json_encode($valeur), time() + $dureeExpiration);
        } else {
            setcookie($cle, json_encode($valeur));
        }
    }

    public static function lire(string $cle): mixed {
        if (isset($_COOKIE[$cle])) {
            return json_decode($_COOKIE[$cle], true);
        } else {
            return [];
        }
    }

    public static function contient($cle): bool {
        return isset($_COOKIE[$cle]);
    }

    public static function supprimer($cle): void {
        unset($_COOKIE[$cle]);
    }
}