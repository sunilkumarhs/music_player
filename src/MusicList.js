import React, { useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import DeleteAudio from "./utils/DeleteAudio";
import setCurPlayTime from "./utils/setCurPlayTime";
import setCurAudio from "./utils/setCurAudio";
import { AddAudioFile } from "./utils/AddAudioFile";
import { fecthAudioFiles } from "./utils/useAudioFiles";
import { fetchPlayingMp3 } from "./utils/useCurrentPlaying";
import { fetchPlayingTime } from "./utils/useCurrentPlayingTime";

const MusicList = ({
  currentAudio,
  setCurrentAudio,
  setPlayTime,
  setIndex,
  audios,
  setAudios,
  setChangePlay,
}) => {
  useEffect(() => {
    fecthAudioFiles().then((data) => setAudios(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPlayingMp3().then((data) => {
      setCurrentAudio(audios[data]);
      setIndex(data);
    });
    fetchPlayingTime().then((data) => setPlayTime(data));
  }, [audios, setCurrentAudio, setPlayTime, setIndex, currentAudio]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await AddAudioFile(file)
        .then(fecthAudioFiles().then((data) => setAudios(data)))
        .catch((e) => alert(e));
    }
  };

  const handleAudioChange = (index) => {
    setCurAudio(index).then(
      fetchPlayingMp3().then((data) => {
        setCurrentAudio(audios[data]);
        setIndex(data);
        setChangePlay(true);
      })
    );
    setCurPlayTime(0).then(
      fetchPlayingTime().then((data) => setPlayTime(data))
    );
  };

  return (
    <div className="lg:w-1/2 w-full  px-2 py-5 text-center section">
      <h1 className="md:p-5 p-2 lg:text-5xl md:text-9xl max-md:text-6xl font-semibold title">
        Music List
      </h1>
      <div className="lg:p-5 p-3">
        <div className="py-2">
          <input
            type="file"
            onChange={handleFileChange}
            className="cursor-pointer absolute z-20 lg:p-2 md:p-6 max-md:p-2 opacity-0"
          />
          <button className="btn1 lg:p-2 md:p-6 max-md:p-2 rounded-full z-10 relative lg:text-xl max-md:text-2xl md:text-3xl">
            <p className="text-sky-900 font-semibold">📥 Upload Music File</p>
          </button>
        </div>
      </div>
      <div className="flex text-start justify-center overflow-y-scroll h-80 no-scrollbar">
        <ul className="text-sky-900">
          {audios?.map((audio, index) => (
            <li
              className={`${
                currentAudio?.name === audio?.name ? "btn2" : "btn1"
              } lg:p-2 md:p-6 max-md:p-2 border-2 my-2 md:text-3xl max-md:text-base lg:text-base flex justify-between`}
              key={audio.name}
            >
              <button onClick={() => handleAudioChange(index)} className="">
                <p className="whitespace-nowrap overflow-hidden text-ellipsis pr-2 text-sky-900 hover:text-rose-700 font-semibold">
                  {audio.name}
                </p>
              </button>
              <RiDeleteBinLine
                className="lg:text-xl md:text-3xl text-xl hover:text-rose-700 text-sky-900"
                onClick={() =>
                  DeleteAudio(audio.name, index, currentAudio).then(
                    fecthAudioFiles().then((data) => setAudios(data))
                  )
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicList;
