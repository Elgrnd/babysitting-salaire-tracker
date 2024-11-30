<?php

namespace App\babysitting\Configuration;

class ConfigurationSite
{
    private static $tempsExpiration = 1800;

    public static function getTempsExpiration(): int
    {
        return self::$tempsExpiration;
    }
    public static function getURLAbsolue(): string {
        return $_SERVER['PHP_SELF'];
    }

    public static function getDebug(): bool {
        return false;
    }


}