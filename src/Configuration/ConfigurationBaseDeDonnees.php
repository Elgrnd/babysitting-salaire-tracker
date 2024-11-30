<?php
namespace App\babysitting\Configuration;
class ConfigurationBaseDeDonnees
{
    static private array $configurationBaseDeDonnees = array(
        // Le nom d'hote est webinfo a l'IUT
        // ou localhost sur votre machine
        //
        // ou webinfo.iutmontp.univ-montp2.fr
        // pour accéder à webinfo depuis l'extérieur
        'nomHote' => 'ep-noisy-hill-a2qku4v9.eu-central-1.aws.neon.tech',
        // A l'IUT, vous avez une base de données nommee comme votre login
        // Sur votre machine, vous devrez creer une base de données
        'nomBaseDeDonnees' => 'neondb',
        // À l'IUT, le port de MySQL est particulier : 3316
        // Ailleurs, on utilise le port par défaut : 3306
        'port' => '5432',
        // A l'IUT, c'est votre login
        // Sur votre machine, vous avez surement un compte 'root'
        'login' => 'neondb_owner',
        // A l'IUT, c'est le même mdp que PhpMyAdmin
        // Sur votre machine personelle, vous avez creez ce mdp a l'installation
        'motDePasse' => 'THXC5K8sGnRu'
    );

    static public function getLogin() : string {
        // L'attribut statique $configurationBaseDeDonnees
        // s'obtient avec la syntaxe ConfigurationBaseDeDonnees::$configurationBaseDeDonnees
        // au lieu de $this->configurationBaseDeDonnees pour un attribut non statique
        return ConfigurationBaseDeDonnees::$configurationBaseDeDonnees['login'];
    }

    static public function getNomHote() : string
    {
        return ConfigurationBaseDeDonnees::$configurationBaseDeDonnees['nomHote'];
    }

    static public function getNomBaseDeDonnees() : string{
        return ConfigurationBaseDeDonnees::$configurationBaseDeDonnees['nomBaseDeDonnees'];
    }

    static public function getPort() : string{
        return ConfigurationBaseDeDonnees::$configurationBaseDeDonnees['port'];
    }

    static public function getMotDePasse() : string{
        return ConfigurationBaseDeDonnees::$configurationBaseDeDonnees['motDePasse'];
    }
}