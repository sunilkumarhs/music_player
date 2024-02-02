import React, { useState, useEffect, useRef } from "react";
import { openDB } from "idb";

const dbPromise = openDB("audio-files", 1, {
  upgrade(db) {
    db.createObjectStore("audios", { keyPath: "name" });
  },
});
const addAudio = async (file) => {
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
  const [hide, setHide] = useState(false);
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
    if (file) {
      await addAudio(file)
        .then(setAudios([...audios, file]))
        .catch((e) => alert(e));
    }
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
      localStorage.setItem("playTime", JSON.stringify(0));
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
  const hidePlay = () => {
    setHide(true);
  };
  return (
    <div className=" w-screen h-screen p-8 flex justify-between main">
      <div className="w-1/2 p-2 text-center section">
        <h1 className="p-5 text-4xl font-semibold">Music List</h1>
        <div className="p-5">
          <div>
            <input
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer absolute z-20 p-2 opacity-0"
            />
            <button className="btn rounded-full z-10 relative text-xl">
              📥 Upload Music File
            </button>
          </div>
        </div>
        <div className="flex text-start justify-center overflow-y-scroll h-80">
          <ul>
            {audios.map((audio, index) => (
              <li
                key={audio.name}
                className="p-2 border-2 my-2 btn hover:bg-slate-300"
              >
                <button onClick={() => handleAudioChange(index)} className="">
                  {index} - {audio.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-1/2 p-2 text-center section">
        <h1 className="p-5 text-4xl font-semibold">Music Player</h1>
        {currentAudio && (
          <div className="flex justify-center py-5">
            <div>
              <audio
                controls
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnd}
              >
                <source
                  src={URL.createObjectURL(currentAudio)}
                  type="audio/mp3"
                />
                Your browser does not support the audio tag.
              </audio>
              <div
                className={`${
                  playTime === 0 ? "hidden" : "block"
                } absolute mx-5 -mt-10 ${hide && "hidden"} `}
                onClick={hidePlay}
              >
                <button onClick={playAtTime} className="bg-slate-300 ">
                  Re
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
