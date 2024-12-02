document.addEventListener('DOMContentLoaded', () => {
    const coffeeLink = document.querySelector('.coffee');
    coffeeLink.addEventListener('click', () => {
        alert('Merci pour votre soutien sur Buy Me a Coffee !');
    });
});

// Exemple de script si vous souhaitez ajouter des interactions
document.addEventListener('DOMContentLoaded', () => {
    const emailLink = document.querySelector('.email');
    emailLink.addEventListener('click', () => {
        alert('Merci de votre intérêt ! N’hésitez pas à m’écrire.');
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../../utils/service-worker.js')
        .then(registration => {
            console.log('Service Worker enregistré avec succès: ', registration);
            
            // Vérification si une nouvelle version du service worker est disponible
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Nouvelle version disponible, afficher un message ou bouton de mise à jour
                        showUpdateButton();
                    }
                };
            };
        })
        .catch(error => {
            console.log('Échec de l\'enregistrement du Service Worker:', error);
        });
    });
}

// Fonction pour afficher un bouton de mise à jour
function showUpdateButton() {
    const updateButton = document.getElementById('updateButton');
    updateButton.style.display = 'block'; // Afficher le bouton de mise à jour
    updateButton.addEventListener('click', () => {
        // Mettre à jour le service worker manuellement
        updateServiceWorker();
    });
}

// Fonction pour mettre à jour le service worker
function updateServiceWorker() {
    navigator.serviceWorker.getRegistration().then(registration => {
        registration.update();  // Met à jour le service worker manuellement
    });
}

