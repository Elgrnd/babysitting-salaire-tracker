<?php

namespace App\babysitting\Lib;

use App\babysitting\Modele\HTTP\Session;

class MessageFlash
{

// Les messages sont enregistrés en session associée à la clé suivante
    private static string $cleFlash = "_messagesFlash";

// $type parmi "success", "info", "warning" ou "danger"
    public static function ajouter(string $type, string $message): void
    {
        Session::getInstance();
        $_SESSION[self::$cleFlash][$type][] = $message;
    }

    public static function contientMessage(string $type): bool
    {
        Session::getInstance();
        return !empty($_SESSION[self::$cleFlash][$type]);
    }

// Attention : la lecture doit détruire le message
    public static function lireMessages(string $type): array
    {
        Session::getInstance();
        $messages = $_SESSION[self::$cleFlash][$type] ?? [];
        unset($_SESSION[self::$cleFlash][$type]); // Supprime les messages lus
        return $messages;
    }

    public static function lireTousMessages(): array
    {
        Session::getInstance();
        $messages = $_SESSION[self::$cleFlash] ?? [];
        unset($_SESSION[self::$cleFlash]); // Supprime tous les messages lus
        return $messages;
    }

}