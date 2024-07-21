import { openDB } from 'idb';

const DATABASE_NAME = 'mementos-db';
const DATABASE_VERSION = 1;
const STORE_NAME = 'guest';

/**
 * Ouvre la base de données IndexedDB
 *
 */
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

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
  return await db.put(STORE_NAME, data);
};

/**
 * Récupère les données du visiteur
 */
export const getGuestData = async () => {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
};

/**
 * Met à jour les données du visiteur
 */
export const updateGuestDataInDB = async (data: { id: number; pseudo: string; niveauRevision: number }) => {
  const db = await getDB();
  return await db.put(STORE_NAME, data);
};

/**
 * Efface les données du visiteur
 */
export const clearGuestData = async () => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
};