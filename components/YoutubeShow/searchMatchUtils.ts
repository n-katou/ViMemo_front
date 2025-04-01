import { YoutubeVideo } from '../../types/youtubeVideo';


export const tokenize = (str: string) =>
  str
    .toLowerCase()
    .split(/[\s、・!！~#『』【】「」\[\]()（）\d、。！？…\/\\\n\t\r]/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2);

export const normalize = (str: string) =>
  str.toLowerCase().replace(/[！!・「」『』【】#\[\]()（）\s\d、。！？…~]/g, '').trim();

export const isMatch = (video: YoutubeVideo, query: string): boolean => {
  const normalizedQuery = normalize(query); // 例: "不可幸力"
  const target = normalize(video.title + ' ' + video.description);
  return target.includes(normalizedQuery);
};
