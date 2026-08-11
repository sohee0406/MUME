const baseUrl = "https://ws.audioscrobbler.com/2.0/";

const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

const fetchMusic = async (method, params = {}) => {
  const url = new URL(baseUrl);

  url.searchParams.set("method", method);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("Last.fm API 요청 실패");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }

  return data;
};

// 인기 음악
export const getTopTracks = () =>
  fetchMusic("chart.gettoptracks", {
    limit: 20,
  });

// 인기 아티스트
export const getTopArtists = () =>
  fetchMusic("chart.gettopartists", {
    limit: 20,
  });

// 인기 앨범
export const getTopAlbums = () =>
  fetchMusic("chart.gettopalbums", {
    limit: 20,
  });

// 장르별 인기 음악
export const getTracksByGenre = (genre) =>
  fetchMusic("tag.gettoptracks", {
    tag: genre,
    limit: 20,
  });

// 장르 정보
export const getGenreInfo = (genre) =>
  fetchMusic("tag.getinfo", {
    tag: genre,
  });

// 아티스트 정보
export const getArtistInfo = (artist) =>
  fetchMusic("artist.getinfo", {
    artist,
  });

// 아티스트 인기 음악 (공통 fetchMusic 활용으로 통일)
export const getArtistTopTracks = (artist) =>
  fetchMusic("artist.gettoptracks", {
    artist,
    limit: 10,
  });

// 아티스트 인기 앨범
export const getArtistTopAlbums = (artist) =>
  fetchMusic("artist.gettopalbums", {
    artist,
    limit: 20,
  });

// 아티스트 태그
export const getArtistTags = (artist) =>
  fetchMusic("artist.gettoptags", {
    artist,
    limit: 10,
  });

// 음악 정보
export const getTrackInfo = (artist, track) =>
  fetchMusic("track.getinfo", {
    artist,
    track,
  });

// 음악 태그
export const getTrackTags = (artist, track) =>
  fetchMusic("track.gettoptags", {
    artist,
    track,
  });

// 비슷한 음악
export const getSimilarTracks = (artist, track) =>
  fetchMusic("track.getsimilar", {
    artist,
    track,
    limit: 20,
  });

// 비슷한 아티스트
export const getSimilarArtists = (artist) =>
  fetchMusic("artist.getsimilar", {
    artist,
    limit: 20,
  });
