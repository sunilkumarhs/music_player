import React, { useEffect, useRef, useState } from "react";
// import MediaPlayer from "./MediaPlayer";

function App() {
  // const [audioFiles, setAudioFiles] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioPlayerRef = useRef(null);
  const fecthAudio = () => {
    window.caches.delete("audioFiles");
    const storedAudioFiles =
      JSON.parse(localStorage.getItem("audioFiles")) || [];
    console.log(storedAudioFiles);
    if (storedAudioFiles.length > 0) {
      setMediaFiles(storedAudioFiles);
    }
  };

  useEffect(() => {
    fecthAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleAudioUpload = (event) => {
  //   const selectedFile = event.target.files[0];
  //   console.log(selectedFile);
  //   if (selectedFile) {
  //     const audioFileURL = URL.createObjectURL(selectedFile);
  //     console.log(audioFileURL);
  //     const audioName = selectedFile.name;
  //     const audioFile = { name: audioName, path: audioFileURL };
  //     setMediaFiles(mediaFiles.push(audioFile));
  //     localStorage.setItem("audioFiles", JSON.stringify(mediaFiles));
  //     fecthAudio();
  //   }
  // };
  const handleAudioUpload = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      const audioBlob = new Blob([selectedFile], { type: selectedFile.type });
      const audioFileURL = URL.createObjectURL(audioBlob);
      console.log(audioFileURL);
      const audioName = selectedFile.name;
      const audioFile = { name: audioName, path: audioFileURL };
      setMediaFiles(mediaFiles.push(audioFile));
      localStorage.setItem("audioFiles", JSON.stringify(mediaFiles));
      fecthAudio();
    }
  };

  const handleAudioChange = (index) => {
    setCurrentAudio(index);
  };
  if (audioPlayerRef.current) {
    audioPlayerRef.current.load();
  }

  return (
    <div>
      <h1>Audio Upload and Play (React)</h1>
      <input type="file" accept="audio/*" onChange={handleAudioUpload} />
      <div>
        {mediaFiles.length > 0 && (
          <div>
            <h2>Uploaded Audio Files:</h2>
            <ul>
              {mediaFiles.map((file, index) => (
                <li key={index}>
                  <button onClick={() => handleAudioChange(index)}>
                    {index} Play Audio {file.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentAudio !== null && (
          <audio controls ref={audioPlayerRef}>
            <source src={mediaFiles[currentAudio]?.path} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>
    </div>
  );
}

export default App;
