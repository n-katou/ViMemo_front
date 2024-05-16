// src/utils.js
export function videoTimestampToSeconds(timestamp) {
    const [minutes, seconds] = timestamp.split(':').map(Number);
    return minutes * 60 + seconds;
  }
  
  export function playFromTimestamp(videoId, seconds) {
    const videoUrl = `https://www.youtube.com/embed/${videoId}?start=${seconds}&autoplay=1`;
    const videoFrame = document.getElementById('youtube-video');
    if (videoFrame) {
      videoFrame.src = videoUrl;
      videoFrame.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
  }
  