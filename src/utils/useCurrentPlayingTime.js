export const fetchPlayingTime = async () => {
  const time = JSON.parse(localStorage.getItem("playTime"));
  return time;
};
