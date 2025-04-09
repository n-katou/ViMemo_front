export const fetchPublicPlaylists = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public_playlists`);
    if (!res.ok) throw new Error("レスポンスエラー");

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("無効なデータ形式");
    }

    return data;
  } catch (error) {
    console.error("fetchPublicPlaylists エラー:", error);
    return [];
  }
};
