import { useEffect } from "react";
import { dbPromise } from "./IndexDbFile";
import setCurAudio from "./setCurAudio";
import setCurPlayTime from "./setCurPlayTime";

const DeleteAudio = (fileName, index, currentAudio) => {
  useEffect(() => {
    deleteAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAudio = async () => {
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
};

export default DeleteAudio;
