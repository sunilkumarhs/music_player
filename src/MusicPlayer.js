import React, { useCallback, useEffect, useMemo, useState } from "react";
import setCurPlayTime from "./utils/setCurPlayTime";
import setCurAudio from "./utils/setCurAudio";
import { fetchPlayingMp3 } from "./utils/useCurrentPlaying";
import { fetchPlayingTime } from "./utils/useCurrentPlayingTime";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import WavesurferPlayer from "@wavesurfer/react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
const MusicPlayer = ({
  currentAudio,
  index,
  playTime,
  setPlayTime,
  audios,
  setCurrentAudio,
  changePlay,
  setChangePlay,
}) => {
  const [audio, setAudio] = useState(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(null);
  const [toPlay, setToPlay] = useState(false);
  useEffect(() => {
    currentAudio && setAudio(URL.createObjectURL(currentAudio));
  }, [currentAudio]);

  const onReady = (ws) => {
    setWavesurfer(ws);
    if ((ws !== played && toPlay === true) || changePlay) {
      setChangePlay(false);
      setToPlay(false);
      ws.play();
    }
  };

  const handleAudioEnd = async () => {
    if (index === audios.length - 1) {
      setCurPlayTime(0).then(
        fetchPlayingTime().then((data) => setPlayTime(data))
      );
      setCurAudio(0).then(
        fetchPlayingMp3().then((data) => setCurrentAudio(audios[data]))
      );
    } else {
      setCurPlayTime(0).then(
        fetchPlayingTime().then((data) => setPlayTime(data))
      );
      setCurAudio(index + 1).then(
        fetchPlayingMp3().then((data) => {
          setCurrentAudio(audios[data]);
        })
      );
    }
  };

  const handleTimeUpdate = () => {
    const time = wavesurfer?.media?.currentTime;
    setPlayTime(time);
    setCurPlayTime(time);
  };

  const onPlayPause = useCallback(() => {
    wavesurfer.media.currentTime = playTime;
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer, playTime]);

  if (wavesurfer?.media?.ended) {
    handleAudioEnd().then(() => {
      setPlayed(wavesurfer);
      setToPlay(true);
    });
  }

  return (
    <div className="lg:w-1/2 p-2 text-center section">
      <h1 className="md:p-5 p-3 text-4xl font-semibold title">Music Player</h1>
      <div className="lg:px-8 px-4">
        <div className="border-[1px] border-gray-300 rounded-xl music">
          {currentAudio && (
            <p className="p-4 text-2xl text-sky-900 font-semibold">
              {currentAudio.name}
            </p>
          )}
          <div className="md:px-2 px-1 py-4">
            <WavesurferPlayer
              height={100}
              waveColor="black"
              responsive={true}
              barWidth={2}
              barHeight={1}
              cursorWidth={0}
              url={audio}
              onReady={onReady}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeupdate={handleTimeUpdate}
              plugins={useMemo(() => [Timeline.create()], [])}
            />
          </div>
          <div className="flex justify-center py-5">
            <div>
              <button className="text-6xl" onClick={onPlayPause} type="button">
                <div className="">
                  {isPlaying ? (
                    <FaCirclePause className="text-cyan-700" />
                  ) : (
                    <FaCirclePlay className="text-cyan-700" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
