import { dbPromise } from "./IndexDbFile";

export const AddAudioFile = async (file) => {
  try {
    const db = await dbPromise;
    const transaction = db.transaction("audios", "readwrite");
    const store = transaction.objectStore("audios");
    store
      .add(file)
      .catch((e) => alert("Music file already exists in store" + e));
  } catch (e) {
    alert("upload error" + e);
  }
};
