import { openDB } from 'idb';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DATABASE_NAME = 'mementos-db';
const DATABASE_VERSION = 3;
const GUEST_STORE_NAME = 'guest';
const THEME_STORE_NAME = 'themes';
const CARD_STORE_NAME = 'cards';
const REVISION_STORE_NAME = 'revisions';

/**
 * Ouvre la base de données IndexedDB et crée les stores nécessaires
 *
 */
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(GUEST_STORE_NAME)) {
      db.createObjectStore(GUEST_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(THEME_STORE_NAME)) {
      const themeStore = db.createObjectStore(THEME_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      themeStore.createIndex('category', 'category');
    }
    if (!db.objectStoreNames.contains(CARD_STORE_NAME)) {
      const cardStore = db.createObjectStore(CARD_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      cardStore.createIndex('theme_id', 'theme_id');
    }
    if (!db.objectStoreNames.contains(REVISION_STORE_NAME)) {
      const revisionStore = db.createObjectStore(REVISION_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      revisionStore.createIndex('carte_id', 'carte_id');
      revisionStore.createIndex('theme_id', 'theme_id');
      revisionStore.createIndex('dateRevision', 'dateRevision');
    }
  },
});

// Niveau maximum global
const MAX_LEVEL = 7;

/**
 * Récupère la base de données
 */
export const getDB = async () => {
  return await dbPromise;
};

/**
 * Ajoute les données du visiteur
 */
export const addGuestData = async (data: { pseudo: string; niveauRevision: number }) => {
  const db = await getDB();
  return await db.put(GUEST_STORE_NAME, data);
};

/**
 * Récupère les données du visiteur
 */
export const getGuestData = async () => {
  const db = await getDB();
  return await db.getAll(GUEST_STORE_NAME);
};

/**
 * Met à jour les données du visiteur
 */
export const updateGuestDataInDB = async (data: { id: number; pseudo: string; niveauRevision: number }) => {
  const db = await getDB();
  return await db.put(GUEST_STORE_NAME, data);
};

/**
 * Efface les données du visiteur
 */
export const clearGuestData = async () => {
  const db = await getDB();
  const tx = db.transaction(GUEST_STORE_NAME, 'readwrite');
  tx.objectStore(GUEST_STORE_NAME).clear();
  return tx.done;
};

/**
 * Efface toutes les données de la base de données
 */
export const clearAllData = async () => {
  const db = await getDB();
  const transaction = db.transaction(
    [GUEST_STORE_NAME, THEME_STORE_NAME, CARD_STORE_NAME, REVISION_STORE_NAME],
    'readwrite'
  );

  transaction.objectStore(GUEST_STORE_NAME).clear();
  transaction.objectStore(THEME_STORE_NAME).clear();
  transaction.objectStore(CARD_STORE_NAME).clear();
  transaction.objectStore(REVISION_STORE_NAME).clear();

  return transaction.done;
};

/**
 * Ajoute un thème
 */
export const addTheme = async (theme: { nom: string; category_nom: string; couleur: string; }): Promise<number> => {
  const db = await getDB();
  const tx = db.transaction(THEME_STORE_NAME, 'readwrite');
  const store = tx.objectStore(THEME_STORE_NAME);
  const themeId = await store.put(theme);
  await tx.done;
  return themeId as number;
};

/**
 * Met à jour un thème en particulier
 * @param theme
 */
export const updateTheme = async (theme: { id: number; nom: string; category_nom: string; couleur: string }) => {
  const db = await getDB();
  const tx = db.transaction(THEME_STORE_NAME, 'readwrite');
  const store = tx.objectStore(THEME_STORE_NAME);
  await store.put(theme);
  await tx.done;
};

/**
 * Récupère un thème par son ID
 * @param themeId
 */
export const getThemeById = async (themeId: number) => {
  const db = await getDB();
  const tx = db.transaction(THEME_STORE_NAME, 'readonly');
  const store = tx.objectStore(THEME_STORE_NAME);
  return await store.get(themeId);
};

/**
 * Récupère les thèmes
 */
export const getThemes = async () => {
  const db = await getDB();
  const tx = db.transaction(THEME_STORE_NAME, 'readonly');
  const store = tx.objectStore(THEME_STORE_NAME);
  return await store.getAll();
};

/**
 * Efface les thèmes
 */
export const clearThemes = async () => {
  const db = await getDB();
  const tx = db.transaction(THEME_STORE_NAME, 'readwrite');
  tx.objectStore(THEME_STORE_NAME).clear();
  return tx.done;
};

/**
 * Supprime un thème en fonction de son id
 */
export const deleteTheme = async (themeId: number) => {
  const db = await getDB();
  return await db.delete(THEME_STORE_NAME, themeId);
};

/**
 * Ajoute une carte
 */
export const addCard = async (card: { question: string; reponse: string; theme_id: number }) => {
  const db = await getDB();
  const tx = db.transaction(CARD_STORE_NAME, 'readwrite');
  const store = tx.objectStore(CARD_STORE_NAME);
  await store.put(card);
  await tx.done;
};

/**
 * Met à jour une carte en particulier
 * @param card
 */
export const updateCard = async (card: { id: number; question: string; reponse: string, theme_id: number }) => {
  const db = await getDB();
  return await db.put(CARD_STORE_NAME, card);
};

/**
 * Récupère les cartes par thème
 */
export const getCardsByTheme = async (theme_id: number) => {
  const db = await getDB();
  return await db.getAllFromIndex(CARD_STORE_NAME, 'theme_id', theme_id);
};

/**
 * Récupère une carte par son ID
 */
export const getCardById = async (cardId: number) => {
  const db = await getDB();
  const tx = db.transaction(CARD_STORE_NAME, 'readonly');
  const store = tx.objectStore(CARD_STORE_NAME);
  return await store.get(cardId);
};

/**
 * Méthode pour récupérer toutes les cartes par thème
 */
export const getAllFromIndex = async (storeName: string, indexName: string, query: any) => {
  const db = await getDB();
  return await db.getAllFromIndex(storeName, indexName, query);
};

/**
 * Efface les cartes
 */
export const clearCards = async () => {
  const db = await getDB();
  const tx = db.transaction(CARD_STORE_NAME, 'readwrite');
  tx.objectStore(CARD_STORE_NAME).clear();
  return tx.done;
};

/**
 * Supprime les cartes par thème
 */
export const deleteCardsByTheme = async (themeId: number) => {
  const db = await getDB();
  const tx = db.transaction(CARD_STORE_NAME, 'readwrite');
  const store = tx.objectStore(CARD_STORE_NAME);
  const index = store.index('theme_id');
  const cards = await index.getAll(IDBKeyRange.only(themeId));
  for (const card of cards) {
    store.delete(card.id);
  }
  return tx.done;
};

/**
 * Supprime une carte en fonction de son id
 */
export const deleteCard = async (cardId: number) => {
  const db = await getDB();
  return await db.delete(CARD_STORE_NAME, cardId);
};

/**
 * Crée une révision
 */
export const addRevision = async (revision: { carte_id: number; theme_id: number; niveau: number; dateRevision: string; dateDerniereRevision?: string | null }) => {
  const db = await getDB();
  return await db.put(REVISION_STORE_NAME, revision);
};

/**
 * Récupère les révisions par carte
 */
export const getRevisionsByCard = async (carte_id: number) => {
  const db = await getDB();
  return await db.getAllFromIndex(REVISION_STORE_NAME, 'carte_id', carte_id);
};

/**
 * Récupère les révisions par thème
 */
export const getRevisionsByTheme = async (theme_id: number) => {
  const db = await getDB();
  const tx = db.transaction(REVISION_STORE_NAME, 'readonly');
  const store = tx.objectStore(REVISION_STORE_NAME);
  const index = store.index('theme_id');
  const revisions = await index.getAll(theme_id);
  await tx.done;
  return revisions;
};

/**
 * Récupère toutes les révisions
 */
export const getAllRevisions = async () => {
  const db = await getDB();
  return await db.getAll(REVISION_STORE_NAME);
};

/**
 * Efface les révisions
 */
export const clearRevisions = async () => {
  const db = await getDB();
  const tx = db.transaction(REVISION_STORE_NAME, 'readwrite');
  tx.objectStore(REVISION_STORE_NAME).clear();
  return tx.done;
};

/**
 * Supprime les révisions pour un thème
 */
export const clearRevisionsByTheme = async (theme_id: number) => {
  const db = await getDB();
  const tx = db.transaction(REVISION_STORE_NAME, 'readwrite');
  const store = tx.objectStore(REVISION_STORE_NAME);
  const index = store.index('theme_id');
  const revisions = await index.getAllKeys(theme_id);

  for (const key of revisions) {
    await store.delete(key);
  }

  return tx.done;
};

/**
 * Supprime les révisions par carte
 */
export const deleteRevisionsByCardIds = async (cardIds: number[]) => {
  const db = await getDB();
  const tx = db.transaction(REVISION_STORE_NAME, 'readwrite');
  const store = tx.objectStore(REVISION_STORE_NAME);
  for (const cardId of cardIds) {
    const index = store.index('carte_id');
    const revisions = await index.getAll(IDBKeyRange.only(cardId));
    for (const revision of revisions) {
      store.delete(revision.id);
    }
  }
  return tx.done;
};

/**
 * Récupère les révisions par date
 */
export const getRevisionsCountByDate = async (date: string) => {
  const db = await getDB();
  const revisions = await db.getAllFromIndex(REVISION_STORE_NAME, 'dateRevision', date);
  return revisions.length;
};

/**
 * Met à jour la révision de l'invité dans la base de données
 */
export const updateGuestRevisionInDB = async (cardId: number, isCorrect: boolean) => {
  const db = await dbPromise;
  const revision = await db.getFromIndex(REVISION_STORE_NAME, 'carte_id', cardId);
  const today = format(new Date(), 'yyyy-MM-dd', { locale: fr });

  // Récupère les données de l'invité pour obtenir le niveau maximum choisi
  const guestData = await db.getAll(GUEST_STORE_NAME);
  const guestMaxLevel = guestData[0]?.niveauRevision || MAX_LEVEL;

  if (revision) {
    if (isCorrect) {
      revision.niveau = Math.min(revision.niveau + 1, guestMaxLevel);
    } else {
      revision.niveau = 1;
    }
    revision.dateRevision = calculateNextRevisionDate(revision.niveau);
    revision.dateDerniereRevision = today;
    await db.put(REVISION_STORE_NAME, revision);
  }
};

/**
 * Méthode pour calculer la prochaine date de révision
 */
const calculateNextRevisionDate = (niveau: number) => {
  const days = Math.pow(2, niveau - 1);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  return format(nextDate, 'yyyy-MM-dd', { locale: fr });
};