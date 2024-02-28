const setCurAudio = async (index) => {
  localStorage.setItem("playingMp3", JSON.stringify(index));
};

export default setCurAudio;
