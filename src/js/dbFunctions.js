let db;

async function initDb() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`
    });

    // Fonction pour créer les tables si elles n'existent pas
    const createTables = () => {
        db.run(`CREATE TABLE IF NOT EXISTS utilisateur (
            nom TEXT PRIMARY KEY, 
            prenom TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS babysittings (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            date TEXT, 
            volume_horaire REAL,
            salaire_heure INTEGER, 
            salaire REAL
        )`);
    };

    // Restaurer la base de données depuis localStorage si disponible
    const savedDb = localStorage.getItem("babysittingDb");
    if (savedDb) {
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        db = new SQL.Database(uint8Array); // Charger la base sauvegardée
        console.log("Base de données restaurée depuis localStorage");
    } else {
        db = new SQL.Database(); // Nouvelle base
        console.log("Nouvelle base de données créée");
    }

    createTables(); // Créer les tables (utilisateur et babysittings)

    // Vérifie si tu es sur la page stats.html ou home.html
    const pathname = window.location.pathname;

    if (pathname.endsWith("stats.html")) {
        sommeTotaleGagnee();
        sommeMoyenneHeure();
        sommeTotaleHeure();
        calculerPrimes();
    } else if (pathname.endsWith("home.html")) {
        checkUtilisateur();
    }
}


function sauvegarderDb() {
    if (db) {
        const data = db.export(); // Exporter la base au format binaire
        localStorage.setItem("babysittingDb", JSON.stringify(Array.from(data)));
        console.log("Base de données sauvegardée dans localStorage");
    }
}

function afficherFormulaireUtilisateur() {
    const container = document.getElementById("userContainer");
    container.innerHTML = `
        <h2>Bienvenue !</h2>
        <p>Veuillez entrer vos informations :</p>
        <form>
        <input type="text" id="nom" placeholder="Nom">
        <input type="text" id="prenom" placeholder="Prénom">
        <button onclick="ajouterUtilisateur()">Enregistrer</button>
        </form>
    `;
}

function ajouterUtilisateur() {
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();

    if (!nom || !prenom) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    db.run("INSERT INTO utilisateur (nom, prenom) VALUES (?, ?)", [nom, prenom]);
    sauvegarderDb();
    afficherMessageBienvenue(prenom);
    afficherBabySittings();
}

function checkUtilisateur() {
    const result = db.exec("SELECT * FROM utilisateur");

    if (result.length > 0 && result[0].values.length > 0) {
        const utilisateur = result[0].values[0];
        const prenom = utilisateur[1]; // Index 1 correspond au prénom
        afficherMessageBienvenue(prenom);
        afficherBabySittings();
    } else {
        afficherFormulaireUtilisateur();
    }
}

function afficherMessageBienvenue(prenom) {
    const container = document.getElementById("userContainer");
    container.innerHTML = `<h2>Bonjour, ${prenom} !</h2>`;
}

function ajouterBabySitting() {
    if (!db) {
        console.error("La base de données n'est pas encore initialisée.");
        return;
    }

    const date = document.getElementById('date').value;
    const heures = document.getElementById('volumeHoraire').value;
    const hour = parseInt(heures.split("h")[0]);
    let min;
    if (heures.split("h")[1] === '') {
        min = 0;
    } else {
        min = parseInt(heures.split("h")[1]);
    }
    console.log(hour);
    console.log(min);
    const volumeHoraire = timeToDecimal(hour, min);
    const salaire = parseFloat(document.getElementById('salaire').value);
    const salaire_heure = parseFloat(document.getElementById('salaire_heure').value);

    if (!date || isNaN(volumeHoraire) || isNaN(salaire)) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    db.run("INSERT INTO babysittings (date, volume_horaire, salaire_heure, salaire) VALUES (?, ?, ?, ?)", [date, volumeHoraire, salaire_heure, salaire]);

    sauvegarderDb(); // Sauvegarder la base après chaque modification
}

function afficherBabySittings() {
    if (!db) {
        console.error("La base de données n'est pas encore initialisée.");
        return;
    }

    const result = db.exec("SELECT * FROM babysittings ORDER BY date");
    const titre = document.getElementById("historique");
    const table = document.getElementById("babysittingTable");

    // Vérifiez si le résultat est vide
    if (result.length === 0 || result[0].values.length === 0) {
        titre.innerHTML = "Aucun babysitting trouvé";
        table.innerHTML = "<tr><td colspan='4'>Aucune donnée disponible.</td></tr>";  // Affichez un message si aucune donnée n'est trouvée
    } else {
        const rows = document.querySelectorAll("table tbody tr");
        titre.innerHTML = "Historique des babysittings";
        table.innerHTML = "<tr><th>Date</th><th>Volume Horaire</th><th>Salaire/h</th><th>Salaire</th></tr>";
        result[0].values.forEach(row => {
            const tr = document.createElement("tr");
            const rowId = row[0];
            tr.setAttribute("id", `row-${rowId}`);

            // Ajoutez les cellules de la ligne
            row.slice(1).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            tr.addEventListener("click", () => {
                rows.forEach(r => r.removeAttribute("selected"));
                tr.setAttribute("selected", "");
                const deleteButton = document.getElementById("delete");
                deleteButton.style.display = "block"
            })
            table.appendChild(tr);
        });
    }
}


function supprimerBabySitting() {
    if (!db) {
        console.error("La base de données n'est pas encore initialisée.");
        return;
    }
    const selectedRows = document.querySelectorAll("tr[selected]");
    selectedRows.forEach(selectedRow => {
        // Extraire l'id de la ligne sélectionnée
        const selectedRowFullId = selectedRow.id; // Ex: "row-123"
        const selectedRowId = selectedRowFullId.split("-")[1]; // Extrait "123"

        // Supprimer l'entrée de la base de données
        try {
            db.exec(`DELETE FROM babysittings WHERE id = ${selectedRowId}`);
            console.log(`Baby-sitting avec ID ${selectedRowId} supprimé.`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'ID ${selectedRowId}:`, error);
        }
    });
    sauvegarderDb(); // Sauvegarder la base après chaque modification
    afficherBabySittings();
}

function sommeTotaleGagnee() {
    if (!db) {
        console.error("La base de données n'est pas encore initialisée.");
        return;
    }

    const result = db.exec("SELECT SUM(salaire) AS total FROM babysittings");
    const salaire_total = document.getElementById("salaire_total");

    if (!salaire_total) {
        console.error("Élément avec l'ID 'salaire_total' introuvable.");
        return;
    }

    if (result.length === 0 || result[0].values.length === 0 || result[0].values[0][0] === null) {
        salaire_total.innerHTML = "<h3>Total gagné : 0.00 €</h3>";
    } else {
        const totalSalaire = result[0].values[0][0];
        salaire_total.innerHTML = `<h3>Total gagné : ${totalSalaire.toFixed(2)} €</h3>`;
    }
}

function sommeMoyenneHeure() {
    if (!db) {
        console.error("La base de données n'est pas encore initialisée.");
        return;
    }

    const result = db.exec("SELECT AVG(salaire_heure) AS moyenne FROM babysittings");
    const salaire_moyen = document.getElementById("salaire_moyen");

    if (!salaire_moyen) {
        console.error("Élément avec l'ID 'salaire_moyen' introuvable.");
        return;
    }

    if (result.length === 0 || result[0].values.length === 0 || result[0].values[0][0] === null) {
        salaire_moyen.innerHTML = "<h3>Salaire moyen par heure : 0.00 €</h3>";
    } else {
        const totalMoyen = result[0].values[0][0];
        salaire_moyen.innerHTML = `<h3>Salaire moyen par heure : ${totalMoyen.toFixed(2)} €</h3>`;
    }
}

function decimalToTime(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
}

function timeToDecimal(hours, minutes) {
    return hours + (minutes / 60); // Additionne les heures et les minutes converties en fraction d'heure
}

function sommeTotaleHeure() {
    if (!db) {
        console.error("La base de données n'est pas encore initialisée.");
        return;
    }

    const result = db.exec("SELECT SUM(volume_horaire) AS heures FROM babysittings");
    const heures_totales = document.getElementById("heures_totales");

    if (!heures_totales) {
        console.error("Élément avec l'ID 'heures_totales' introuvable.");
        return;
    }

    if (result.length === 0 || result[0].values.length === 0 || result[0].values[0][0] === null) {
        heures_totales.innerHTML = "<h3>Aucun babysitting effectué</h3>";
    } else {
        const heuresTotales = result[0].values[0][0];
        heures_totales.innerHTML = `<h3>Heures totales effectuées : ${decimalToTime(heuresTotales)}</h3>`;
    }
}

function calculerPrimes() {
    if (!db) {
        console.error("La base de données n'est pas encore initialisée.");
        return;
    }
    let montantPrimes = 0;
    const result = db.exec('SELECT * FROM babysittings');
    const primes = document.getElementById("primes")

    if (!primes) {
        console.error("Élément avec l'ID 'primes' introuvable.");
        return;
    }

    if (result.length === 0 || result[0].values.length === 0 || result[0].values[0][0] === null) {
        primes.innerHTML = "<h3>Primes totales : 0.00 €</h3>";
    } else {
        result[0].values.forEach(row => {
            const salaire = row[4];
            const volume_horaire = row[2];
            const salaire_heure = row[3];

            montantPrimes += salaire - volume_horaire * salaire_heure;
        })
        primes.innerHTML = `<h3> Primes totales : ${montantPrimes.toFixed(2)} €</h3>`
    }
}


window.addEventListener("beforeunload", sauvegarderDb); // Sauvegarder avant de quitter la page
initDb();

