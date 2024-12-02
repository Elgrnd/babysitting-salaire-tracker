let db;

async function initDb() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`
    });

    // Restaurer la base de données depuis localStorage si disponible
    const savedDb = localStorage.getItem("babysittingDb");
    if (savedDb) {
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        db = new SQL.Database(uint8Array); // Charger la base sauvegardée
        db.run(`CREATE TABLE IF NOT EXISTS utilisateur (
            nom TEXT PRIMARY KEY, 
            prenom TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS babysittings (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            date TEXT, 
            volume_horaire INTEGER,
            salaire_heure INTEGER, 
            salaire REAL
        )`);
        console.log("Base de données restaurée depuis localStorage");
    } else {
        db = new SQL.Database(); // Nouvelle base
        db.run(`CREATE TABLE IF NOT EXISTS babysittings (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            date TEXT, 
            volume_horaire INTEGER,
            salaire_heure INTEGER, 
            salaire REAL
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS utilisateur (
            nom TEXT PRIMARY KEY, 
            prenom TEXT
        )`);
        console.log("Nouvelle base de données créée");
    }

    checkUtilisateur(); // Vérifier si un utilisateur existe
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
    const volumeHoraire = parseInt(document.getElementById('volumeHoraire').value);
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

    const result = db.exec("SELECT * FROM babysittings");
    const titre = document.getElementById("historique");
    const table = document.getElementById("babysittingTable");

    titre.innerHTML = "Historique des babysittings"
    if (result.length !== 0) {
        table.innerHTML = "<tr><th>Date</th><th>Volume Horaire</th><th>Salaire h</th><th>Salaire</th></tr>";
    }

    if (result.length > 0) {
        result[0].values.forEach(row => {
            const tr = document.createElement("tr");
            // Ignorer la première colonne (index 0)
            row.slice(1).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
    }
    
}

window.addEventListener("beforeunload", sauvegarderDb); // Sauvegarder avant de quitter la page
initDb();
