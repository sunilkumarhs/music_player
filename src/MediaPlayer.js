import React, { useState, useEffect } from "react";
import { openDB } from "idb";

// Open or create the database
const dbPromise = openDB("audio-files", 1, {
  upgrade(db) {
    db.createObjectStore("audios", { keyPath: "name" });
  },
});

// Add an audio file to the database
const addAudio = async (file) => {
  const db = await dbPromise;
  const transaction = db.transaction("audios", "readwrite");
  const store = transaction.objectStore("audios");
  store.add(file);
};

// Fetch all audio files from the database
const getAllAudios = async () => {
  const db = await dbPromise;
  const transaction = db.transaction("audios", "readonly");
  const store = transaction.objectStore("audios");
  const request = store.getAll();
  const audios = await request.then((result) => result.map((value) => value));
  return audios;
};
const MediaPlayer = () => {
  const [audios, setAudios] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    // Fetch audios on component mount
    getAllAudios().then(setAudios);
    // setCurrentAudio(audios[0]);
  }, []);

  // audios.map((audio) => console.log(audio, typeof audio));
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await addAudio(file);
    setAudios([...audios, file]);
  };

  const handleAudioChange = (index) => {
    setCurrentAudio(audios[index]);
  };
  console.log(currentAudio);

  return (
    <div>
      <h1>Audio Uploading</h1>
      <input type="file" onChange={handleFileChange} />
      <ul>
        {audios.map((audio, index) => (
          <li key={audio.name}>
            {/* <audio src={URL.createObjectURL(audio)} controls /> */}
            <button onClick={() => handleAudioChange(index)}>
              {index} Play Audio {audio.name}
            </button>
          </li>
        ))}
      </ul>
      {currentAudio !== null && (
        <audio src={URL.createObjectURL(currentAudio)} controls />
      )}
    </div>
  );
};

export default MediaPlayer;
