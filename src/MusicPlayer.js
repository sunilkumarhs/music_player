import React, { useCallback, useEffect, useMemo, useState } from "react";
import setCurPlayTime from "./utils/setCurPlayTime";
import setCurAudio from "./utils/setCurAudio";
import { fetchPlayingMp3 } from "./utils/useCurrentPlaying";
import { fetchPlayingTime } from "./utils/useCurrentPlayingTime";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import WavesurferPlayer from "@wavesurfer/react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { BiSolidSkipPreviousCircle } from "react-icons/bi";
// import { TbRepeatOnce } from "react-icons/tb";
// import { BiSolidPlaylist } from "react-icons/bi";
import { TbRepeatOff } from "react-icons/tb";
import { SiMusicbrainz } from "react-icons/si";
import { TbRepeat } from "react-icons/tb";
const MusicPlayer = ({
  currentAudio,
  index,
  playTime,
  setPlayTime,
  audios,
  setCurrentAudio,
  changePlay,
  setChangePlay,
  wavesurfer,
  setWavesurfer,
}) => {
  const [audio, setAudio] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(null);
  const [toPlay, setToPlay] = useState(false);
  const [repeat, setRepeat] = useState(false);
  useEffect(() => {
    currentAudio && setAudio(URL.createObjectURL(currentAudio));
  }, [currentAudio]);

  const onReady = (ws) => {
    setWavesurfer(ws);
    setRepeat(false);
    if ((ws !== played && toPlay === true) || changePlay) {
      setChangePlay(false);
      setToPlay(false);
      ws.media.currentTime = playTime;
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

  const handleRepeat = () => {
    setRepeat(!repeat);
  };

  if (wavesurfer?.media?.ended) {
    if (repeat === true) {
      setRepeat(false);
      wavesurfer.playPause();
    } else {
      handleAudioEnd().then(() => {
        setPlayed(wavesurfer);
        setToPlay(true);
      });
    }
  }

  const handleNext = async () => {
    if (index !== audios.length - 1) {
      setCurPlayTime(0).then(
        fetchPlayingTime().then((data) => setPlayTime(data))
      );
      setCurAudio(index + 1).then(
        fetchPlayingMp3().then((data) => setCurrentAudio(audios[data]))
      );
    }
  };

  const handlePrevious = async () => {
    if (index !== 0) {
      setCurPlayTime(0).then(
        fetchPlayingTime().then((data) => setPlayTime(data))
      );
      setCurAudio(index - 1).then(
        fetchPlayingMp3().then((data) => setCurrentAudio(audios[data]))
      );
    }
  };

  return (
    <div className={`lg:w-1/2 w-full py-6 text-center section`}>
      <div className="lg:px-8 px-4">
        <div className="border-[1px] border-gray-300 rounded-xl music">
          <div className="flex justify-center p-2 ">
            <SiMusicbrainz className="lg:text-9xl text-[14rem] border-[1px] p-1 border-emerald-700 rounded-full player text-cyan-900" />
          </div>
          {currentAudio && (
            <div className="flex justify-center px-2">
              <p className="p-2 lg:text-2xl text-4xl text-sky-900 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {currentAudio.name}
              </p>
              <button onClick={handleRepeat}>
                {repeat ? (
                  <TbRepeat className="lg:text-3xl text-4xl text-sky-900 hover:text-sky-700" />
                ) : (
                  <TbRepeatOff className="lg:text-3xl text-4xl text-sky-900 hover:text-sky-700" />
                )}
              </button>
            </div>
          )}
          <div className="md:px-2 px-1 py-4">
            <WavesurferPlayer
              height={120}
              waveColor="skyblue"
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
            <div className="flex">
              <button
                className="lg:text-6xl md:text-8xl text-6xl px-2"
                type="button"
                onClick={() =>
                  handlePrevious().then(() => {
                    setPlayed(wavesurfer);
                    setToPlay(true);
                  })
                }
              >
                <BiSolidSkipPreviousCircle
                  className={` ${
                    index === 0
                      ? "text-cyan-700"
                      : " text-cyan-900 hover:text-cyan-700"
                  }`}
                />
              </button>
              <button
                className="lg:text-6xl md:text-8xl text-6xl"
                onClick={onPlayPause}
                type="button"
              >
                {isPlaying ? (
                  <FaCirclePause className="text-cyan-900 hover:text-cyan-700" />
                ) : (
                  <FaCirclePlay className="text-cyan-900 hover:text-cyan-700" />
                )}
              </button>
              <button
                className="lg:text-6xl md:text-8xl text-6xl px-2"
                type="button"
                onClick={() =>
                  handleNext().then(() => {
                    setPlayed(wavesurfer);
                    setToPlay(true);
                  })
                }
              >
                <BiSolidSkipNextCircle
                  className={` ${
                    index === audios.length - 1
                      ? "text-cyan-700"
                      : " text-cyan-900 hover:text-cyan-700"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
