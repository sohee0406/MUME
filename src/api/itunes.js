// iTunes API CORS 우회를 위한 프록시
const baseUrl = "https://api.allorigins.win/raw?url=";
const targetUrl = "https://itunes.apple.com/";

const fetchMusic = async (endpoint) => {
  const target = `${targetUrl}${endpoint}`;
  const queryUrl = `${baseUrl}${encodeURIComponent(target)}`;

  const response = await fetch(queryUrl);

  if (!response.ok) {
    throw new Error(`iTunes API 요청 실패 (${response.status})`);
  }

  return response.json();
};

// 음악 검색
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
