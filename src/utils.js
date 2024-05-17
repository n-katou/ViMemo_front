// src/utils.js
export function videoTimestampToSeconds(timestamp) {
  console.log('Converting timestamp:', timestamp); // デバッグログ追加
  const [minutes, seconds] = timestamp.split(':').map(Number);
  if (isNaN(minutes) || isNaN(seconds)) {
    console.error('Invalid timestamp format:', timestamp); // エラーログ追加
    return 0;
  }
  return minutes * 60 + seconds;
}

export function playFromTimestamp(seconds) {
  const videoFrame = document.getElementById('youtube-video');
  if (videoFrame) {
    const videoId = videoFrame.getAttribute('data-video-id');
    if (videoId) {
      const videoUrl = `https://www.youtube.com/embed/${videoId}?start=${seconds}&autoplay=1`;
      console.log(`Playing video ${videoId} from ${seconds} seconds`);
      videoFrame.src = videoUrl;
      videoFrame.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    } else {
      console.error('Video ID not found');
    }
  } else {
    console.error('Video frame not found');
  }
}
