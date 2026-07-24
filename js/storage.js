/* ==========================================================================
   HAKAI ART AGENCY - IndexedDB Storage Manager
   Store & Retrieve uploaded Artwork images/videos locally in browser
   ========================================================================== */

class HakaiStorageManager {
  constructor() {
    this.dbName = "HakaiArtAgencyDB";
    this.dbVersion = 1;
    this.storeName = "artworks";
    this.db = null;
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error("IndexedDB error:", e.target.error);
        reject(e.target.error);
      };
    });
  }

  async saveArtwork(artworkObj) {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(artworkObj);

      request.onsuccess = () => resolve(artworkObj);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getAllUploadedArtworks() {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async deleteArtwork(id) {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }
}

window.hakaiStorage = new HakaiStorageManager();
