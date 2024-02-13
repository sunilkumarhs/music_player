import React, { useState, useEffect, useRef } from "react";
import { openDB } from "idb";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrResume } from "react-icons/gr";

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
    fetchPlayingMp3().then((play) => {
      setCurrentAudio(audios[play]);
      setIndex(play);
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
    localStorage.setItem("playTime", JSON.stringify(0));
    if (audioRef.current) {
      audioRef.current.load();
    }
  };
  const deleteAudio = async (fileName, index) => {
    try {
      const db = await dbPromise;
      const transaction = db.transaction("audios", "readwrite");
      const store = transaction.objectStore("audios");
      const key = await store.getKey(fileName);
      if (key) {
        if (currentAudio !== undefined && currentAudio?.name === fileName) {
          setCurrentAudio(null);
          setPlayTime(0);
        }
        getAllAudios().then(setAudios);
        await store.delete(key);
      } else {
        alert("Music file not found.");
      }
    } catch (error) {
      alert("Error deleting music file:" + error);
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
        audioRef.current.paly();
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
    <div className=" w-screen h-screen md:p-8 p-2 flex lg:flex-row flex-col main">
      <div className="lg:w-1/2 p-2 text-center section">
        <h1 className="md:p-5 p-2 text-4xl font-semibold">Music List</h1>
        <div className="md:p-5 p-2">
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
        <div className="flex text-start justify-center overflow-y-scroll h-80 no-scrollbar">
          <ul className="">
            {audios.map((audio, index) => (
              <li
                className="p-2 border-2 my-2 btn hover:bg-slate-200 text-sm md:text-base flex justify-between"
                key={audio.name}
              >
                <button onClick={() => handleAudioChange(index)} className="">
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis pr-2">
                    {index} - {audio.name}
                  </p>
                </button>
                <RiDeleteBinLine
                  className="text-xl hover:text-rose-700"
                  onClick={() => deleteAudio(audio.name, index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg:w-1/2 p-2 text-center section">
        <h1 className="md:p-5 p-2 text-4xl font-semibold">Music Player</h1>
        {currentAudio && (
          <div>
            <p className="p-4 text-xl text-purple-700">{currentAudio.name}</p>
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
                  } absolute mx-5 -mt-9 ${hide && "hidden"} `}
                  onClick={hidePlay}
                >
                  <GrResume onClick={playAtTime} className="text-xl bg-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
