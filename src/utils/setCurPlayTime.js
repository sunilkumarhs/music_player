const setCurPlayTime = async (time) => {
  localStorage.setItem("playTime", JSON.stringify(time));
};

export default setCurPlayTime;
