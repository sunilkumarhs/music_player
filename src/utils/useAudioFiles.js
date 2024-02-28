import { dbPromise } from "./IndexDbFile";

export const fecthAudioFiles = async () => {
  const db = await dbPromise;
  const transaction = db.transaction("audios", "readonly");
  const store = transaction.objectStore("audios");
  const request = store.getAll();
  const audios = await request.then((result) => result.map((value) => value));
  return audios;
};
