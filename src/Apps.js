import React, { useState } from "react";
import MusicPlayer from "./MusicPlayer";
import MusicList from "./MusicList";

function App() {
  const [audios, setAudios] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playTime, setPlayTime] = useState(0);
  const [index, setIndex] = useState(0);
  const [changePlay, setChangePlay] = useState(false);
  const [wavesurfer, setWavesurfer] = useState(null);

  return (
    <div className=" w-screen lg:h-screen h-full md:p-8 p-2 flex lg:flex-row flex-col main">
      <MusicPlayer
        currentAudio={currentAudio}
        index={index}
        playTime={playTime}
        setPlayTime={setPlayTime}
        audios={audios}
        setCurrentAudio={setCurrentAudio}
        changePlay={changePlay}
        setChangePlay={setChangePlay}
        wavesurfer={wavesurfer}
        setWavesurfer={setWavesurfer}
      />
      <MusicList
        currentAudio={currentAudio}
        setCurrentAudio={setCurrentAudio}
        setPlayTime={setPlayTime}
        setIndex={setIndex}
        audios={audios}
        setAudios={setAudios}
        setChangePlay={setChangePlay}
        index={index}
        wavesurfer={wavesurfer}
      />
    </div>
  );
}

export default App;
