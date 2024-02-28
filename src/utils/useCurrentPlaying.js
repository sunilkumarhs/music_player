export const fetchPlayingMp3 = async () => {
  const audioIndex = JSON.parse(localStorage.getItem("playingMp3"));
  return audioIndex;
};
