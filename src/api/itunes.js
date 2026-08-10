const baseUrl = "https://itunes.apple.com/";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

const fetchMusic = async (endpoint) => {
  const url = new URL(baseUrl + endpoint);

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("iTunes API 요청 실패");
  }

  return response.json();
};

// 음악 검색
export const getSearch = (keyword) =>
  fetchMusic(
    `search?term=${encodeURIComponent(keyword)}&media=music&entity=song&country=KR&limit=20`,
  );

// 아티스트 검색
export const getArtistSearch = (keyword) =>
  fetchMusic(
    `search?term=${encodeURIComponent(keyword)}&media=music&entity=musicArtist&country=KR&limit=20`,
  );

// 앨범 검색
export const getAlbumSearch = (keyword) =>
  fetchMusic(
    `search?term=${encodeURIComponent(keyword)}&media=music&entity=album&country=KR&limit=20`,
  );

// 특정 아티스트의 음악 검색
export const getArtistSongs = (artist) =>
  fetchMusic(
    `search?term=${encodeURIComponent(artist)}&media=music&entity=song&country=KR&limit=20`,
  );

// 장르별 음악 검색
export const getGenreMusic = (genre) =>
  fetchMusic(
    `search?term=${encodeURIComponent(genre)}&media=music&entity=song&country=KR&limit=20`,
  );
