const targetUrl = "https://itunes.apple.com/";

const fetchMusic = async (endpoint) => {
  try {
    const queryUrl = `${targetUrl}${endpoint}`;

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new Error(`iTunes API 요청 실패 (${response.status})`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("iTunes API 오류:", error);

    throw error;
  }
};

// 검색
export const getSearch = (keyword) =>
  fetchMusic(
    `search?term=${encodeURIComponent(
      keyword,
    )}&media=music&entity=song&country=KR&limit=15`,
  );

// 아티스트 검색
export const getArtistSearch = (keyword) =>
  fetchMusic(
    `search?term=${encodeURIComponent(
      keyword,
    )}&media=music&entity=musicArtist&country=KR&limit=15`,
  );

// 앨범 검색
export const getAlbumSearch = (keyword) =>
  fetchMusic(
    `search?term=${encodeURIComponent(
      keyword,
    )}&media=music&entity=album&country=KR&limit=15`,
  );

// 특정 아티스트의 음악 검색
export const getArtistSongs = (artist) =>
  fetchMusic(
    `search?term=${encodeURIComponent(
      artist,
    )}&media=music&entity=song&country=KR&limit=15`,
  );

// 장르별 음악 검색
export const getGenreMusic = (genre) =>
  fetchMusic(
    `search?term=${encodeURIComponent(
      genre,
    )}&media=music&entity=song&country=KR&limit=15`,
  );
