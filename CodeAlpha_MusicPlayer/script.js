const songs = [
  { title: "Your First Song", artist: "Add an MP3", file: "music/song1.mp3" },
  { title: "Your Second Song", artist: "Add an MP3", file: "music/song2.mp3" },
  { title: "Your Third Song", artist: "Add an MP3", file: "music/song3.mp3" }
];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const playlist = document.getElementById("playlist");
const volume = document.getElementById("volume");
let index = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function loadSong(i) {
  index = (i + songs.length) % songs.length;
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.file;
  renderPlaylist();
}
function renderPlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, i) => {
    const item = document.createElement("div");
    item.className = "song" + (i === index ? " active" : "");
    item.innerHTML = `<span>${song.title}</span><small>${song.artist}</small>`;
    item.onclick = () => { loadSong(i); audio.play().catch(() => {}); };
    playlist.appendChild(item);
  });
}
async function togglePlay() {
  if (audio.paused) {
    try { await audio.play(); } catch { alert("Add your MP3 files to the music folder first."); }
  } else audio.pause();
}
playBtn.onclick = togglePlay;
document.getElementById("prev").onclick = () => { loadSong(index - 1); audio.play().catch(() => {}); };
document.getElementById("next").onclick = () => { loadSong(index + 1); audio.play().catch(() => {}); };
audio.addEventListener("play", () => playBtn.textContent = "⏸");
audio.addEventListener("pause", () => playBtn.textContent = "▶");
audio.addEventListener("loadedmetadata", () => duration.textContent = formatTime(audio.duration));
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
});
progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});
volume.addEventListener("input", () => audio.volume = volume.value);
audio.addEventListener("ended", () => { loadSong(index + 1); audio.play().catch(() => {}); });
loadSong(0);
audio.volume = .8;
