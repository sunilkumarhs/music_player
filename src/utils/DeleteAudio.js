import { dbPromise } from "./IndexDbFile";
import setCurAudio from "./setCurAudio";
import setCurPlayTime from "./setCurPlayTime";

const DeleteAudio = async (fileName, currentAudio) => {
  try {
    const db = await dbPromise;
    const transaction = db.transaction("audios", "readwrite");
    const store = transaction.objectStore("audios");
    const key = await store.getKey(fileName);
    if (key) {
      if (currentAudio !== undefined && currentAudio?.name === fileName) {
        setCurAudio(0);
        setCurPlayTime(0);
      }
      await store.delete(key);
    } else {
      alert("Music file not found.");
    }
  } catch (error) {
    alert("Error deleting music file:" + error);
  }
};

export default DeleteAudio;
