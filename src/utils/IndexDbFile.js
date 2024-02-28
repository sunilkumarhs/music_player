import { openDB } from "idb";

export const dbPromise = openDB("audio-files", 1, {
  upgrade(db) {
    db.createObjectStore("audios", { keyPath: "name" });
  },
});
