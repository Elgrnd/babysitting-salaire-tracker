<?php
namespace App\babysitting\Modele\Repository;
use App\babysitting\Configuration\ConfigurationBaseDeDonnees;
use \PDO as PDO;
Class ConnexionBaseDeDonnees  {
    private static ?ConnexionBaseDeDonnees $instance = null;
    private PDO $pdo;

    public static function getPdo(): PDO {
        return ConnexionBaseDeDonnees::getInstance()->pdo;
    }
    public function __construct(){
        $login = ConfigurationBaseDeDonnees::getLogin();
        $motDePasse = ConfigurationBaseDeDonnees::getMotDePasse();
        $nomHote = ConfigurationBaseDeDonnees::getNomHote();
        $port = ConfigurationBaseDeDonnees::getPort();
        $nomBaseDeDonnees = ConfigurationBaseDeDonnees::getNomBaseDeDonnees();
        // Connexion à la base de données
        // Le dernier argument sert à ce que toutes les chaines de caractères
        // en entrée et sortie de MySql soient dans le codage UTF-8
        $this->pdo = new PDO("pgsql:host=$nomHote;port=$port;dbname=$nomBaseDeDonnees", $login, $motDePasse,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Active les exceptions pour erreurs
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // Définit le mode de fetch par défaut
            ]);

        // On active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);



    }

    private static function getInstance() : ConnexionBaseDeDonnees {
        // L'attribut statique $instance s'obtient avec la syntaxe ConnexionBaseDeDonnees::$instance
        if (is_null(ConnexionBaseDeDonnees::$instance))
            // Appel du constructeur
            ConnexionBaseDeDonnees::$instance = new ConnexionBaseDeDonnees();
        return ConnexionBaseDeDonnees::$instance;
    }


}