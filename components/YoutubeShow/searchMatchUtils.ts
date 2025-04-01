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
  const queryTokens = tokenize(query); // クエリを分割

  const titleTokens = tokenize(video.title);
  const descriptionTokens = tokenize(video.description || '');

  const combinedTokens = [...titleTokens, ...descriptionTokens];

  // クエリのいずれかが、タイトルまたは説明文のどれかに部分一致するか
  return queryTokens.some((token) =>
    combinedTokens.some((word) => word.includes(token))
  );
};
