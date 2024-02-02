import React, { useState, useEffect, useRef } from "react";
import { openDB } from "idb";

const dbPromise = openDB("audio-files", 1, {
  upgrade(db) {
    db.createObjectStore("audios", { keyPath: "name" });
  },
});
const addAudio = async (file) => {
  const db = await dbPromise;
  const transaction = db.transaction("audios", "readwrite");
  const store = transaction.objectStore("audios");
  store.add(file);
};
const getAllAudios = async () => {
  const db = await dbPromise;
  const transaction = db.transaction("audios", "readonly");
  const store = transaction.objectStore("audios");
  const request = store.getAll();
  const audios = await request.then((result) => result.map((value) => value));
  return audios;
};
const fetchPlayingMp3 = async () => {
  const play = JSON.parse(localStorage.getItem("playingMp3"));
  return play;
};
const fetchPlayingTime = () => {
  const time = JSON.parse(localStorage.getItem("playTime"));
  return time;
};

function App() {
  const [audios, setAudios] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playTime, setPlayTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const [index, setIndex] = useState(null);
  useEffect(() => {
    getAllAudios().then(setAudios);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPlayingMp3().then((index) => {
      setCurrentAudio(audios[index]);
      setIndex(index);
    });
  }, [audios]);

  useEffect(() => {
    setPlayTime(fetchPlayingTime);
  }, [currentAudio]);

  const playAtTime = () => {
    audioRef.current.currentTime = playTime;
    audioRef.current.play();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await addAudio(file);
    setAudios([...audios, file]);
  };
  const handleAudioChange = (index) => {
    setIndex(index);
    setCurrentTime(0);
    setCurrentAudio(audios[index]);
    localStorage.setItem("playingMp3", JSON.stringify(index));
    localStorage.setItem("playTime", JSON.stringify(currentTime));
    if (audioRef.current) {
      audioRef.current.load();
    }
  };
  const handleAudioEnd = () => {
    if (index === audios.length - 1) {
      setIndex(0);
      setCurrentAudio(audios[0]);
      localStorage.setItem("playingMp3", JSON.stringify(0));
      localStorage.setItem("playTime", JSON.stringify(0));
      if (audioRef.current && index === 0) {
        audioRef.current.load();
        audioRef.current.play();
      }
    } else {
      setIndex(index + 1);
      setCurrentAudio(audios[index + 1]);
      localStorage.setItem("playingMp3", JSON.stringify(index + 1));
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  };
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    localStorage.setItem("playTime", JSON.stringify(currentTime));
  };
  return (
    <div>
      <h1>Audio Uploading</h1>
      <input type="file" onChange={handleFileChange} />
      <ul>
        {audios.map((audio, index) => (
          <li key={audio.name}>
            <button onClick={() => handleAudioChange(index)}>
              {index} Play Audio {audio.name}
            </button>
          </li>
        ))}
      </ul>
      {currentAudio && (
        <div>
          <audio
            controls
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnd}
          >
            <source src={URL.createObjectURL(currentAudio)} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
          <button onClick={playAtTime}>Play</button>
        </div>
      )}
    </div>
  );
}

export default App;
