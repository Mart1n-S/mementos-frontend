import './assets/main.css'
import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { openDB } from 'idb';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Enregistrer le service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.ts')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}


/**
 * POUR LES UTILISATEURS INVITÉS UNIQUEMENT
 * Fonction pour vérifier les révisions et envoyer une notification
 */
async function checkRevisionsAndNotify() {
    const today = format(new Date(), 'yyyy-MM-dd', { locale: fr });

    const db = await openDB('mementos-db', 3);
    const revisions = await db.getAllFromIndex('revisions', 'dateRevision', today);

    if (revisions.length > 0) {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SHOW_NOTIFICATION',
                title: 'MEMENTOS',
                options: {
                    body: 'C\'est l\'heure de réviser votre Mementos!',
                    icon: 'src/assets/images/logo.svg',
                    badge: 'src/assets/images/logo.svg',
                    data: '/mon-mementos'
                }
            });
        }
    }
}

// Fonction pour vérifier s'il y a un utilisateur invité dans IndexedDB
async function isGuestUser(): Promise<boolean> {
    const db = await openDB('mementos-db', 3);
    const guestData = await db.getAll('guest');
    return guestData.length > 0;
}

// POUR DÉMARRER LA VÉRIFICATION QUOTIDIENNE à 8h ET METTRE A JOUR LES REVISIONS MANQUÉES
// async function updateMissedRevisions() {
//     const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd', { locale: fr });

//     const db = await openDB('mementos-db', 3);
//     const missedRevisions = await db.getAllFromIndex('revisions', 'dateRevision', yesterday);

//     for (const revision of missedRevisions) {
//         const newDateRevision = format(addDays(new Date(), 2 ** (revision.niveau - 1)), 'yyyy-MM-dd', { locale: fr });

//         revision.dateRevision = newDateRevision;
//         revision.dateDerniereRevision = format(new Date(), 'yyyy-MM-dd', { locale: fr });
//         await db.put('revisions', revision);
//     }
// }

// // Fonction pour obtenir le temps jusqu'à minuit
// function getTimeUntilNextMidnight() {
//     const now = new Date();
//     const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
//     return nextMidnight.getTime() - now.getTime();
// }

// // Fonction pour obtenir le temps jusqu'à 8h du matin
// function getTimeUntilNext8AM() {
//     const now = new Date();
//     const next8AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
//     if (now > next8AM) {
//         next8AM.setDate(next8AM.getDate() + 1);
//     }
//     return next8AM.getTime() - now.getTime();
// }

// // Fonction pour démarrer la vérification quotidienne
// async function startDailyCheck() {
//     const isGuest = await isGuestUser();

//     if (isGuest) {
//         // Démarrer la vérification des révisions à 8h du matin
//         const timeUntilNext8AM = getTimeUntilNext8AM();
//         setTimeout(() => {
//             checkRevisionsAndNotify();
//             setInterval(checkRevisionsAndNotify, 24 * 60 * 60 * 1000); // Répéter toutes les 24 heures
//         }, timeUntilNext8AM);

//         // Démarrer la mise à jour des révisions manquées à minuit
//         const timeUntilNextMidnight = getTimeUntilNextMidnight();
//         setTimeout(() => {
//             updateMissedRevisions();
//             setInterval(updateMissedRevisions, 24 * 60 * 60 * 1000); // Répéter toutes les 24 heures
//         }, timeUntilNextMidnight);
//     }
// }

// // Démarrer le compte à rebours au chargement de la page si l'utilisateur est invité
// startDailyCheck();

// POUR TESTER PENDANT LA PRESENTATION (uniquement l'affichage de la notification ✅ / Mise à jour des révisions manquées ❌)
let countdown = 60;

async function startCountdown() {
    const isGuest = await isGuestUser();

    if (isGuest) {
        setInterval(() => {
            console.log(`Temps restant avant la prochaine vérification : ${countdown} secondes`);
            countdown--;

            if (countdown <= 0) {
                checkRevisionsAndNotify();
                countdown = 60; // Réinitialiser le compte à rebours après la vérification
            }
        }, 1000); // Mettre à jour toutes les secondes
    }
}

// Démarrer le compte à rebours au chargement de la page si l'utilisateur est invité
startCountdown();