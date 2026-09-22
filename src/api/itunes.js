const BASE_URL = "https://itunes.apple.com/search";

/**
 * iTunes API 공통 요청
 */
async function fetchMusic(params = {}) {
  const searchParams = new URLSearchParams({
    country: "KR",
    media: "music",
    limit: "50",
    ...params,
  });

  const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`iTunes API 요청 실패: ${response.status}`);
  }

  const data = await response.json();

  console.log("iTunes API:", params.term, data);

  return data;
}

/**
 * 일반 음악 검색
 */
export async function getSearch(keyword) {
  return fetchMusic({
    term: keyword,
  });
}

/**
 * 아티스트 음악 검색
 */
export async function getArtistSongs(artist) {
  return fetchMusic({
    term: artist,
    attribute: "artistTerm",
  });
}

/**
 * 장르별 음악 검색
 */
export async function getGenreMusic(genre) {
  return fetchMusic({
    term: genre,
  });
}

/**
 * iTunes에서 가져온 음악 중
 * 실제 재생 가능한 곡만 추출
 *
 * 중요:
 * iTunes가 music-video를 반환하는 경우도 있기 때문에
 * kind === "song"만 강제로 요구하지 않는다.
 */
export function filterMusicTracks(results = []) {
  return results.filter((item) => {
    return (
      item?.wrapperType === "track" &&
      item?.trackId &&
      item?.trackName &&
      item?.artistName &&
      item?.previewUrl
    );
  });
}

/**
 * 재생 가능한 첫 번째 곡
 */
export function findPreviewTrack(results = []) {
  return filterMusicTracks(results)[0] || null;
}

/**
 * 재생 가능한 곡 여러 개
 */
export function findPreviewTracks(results = [], count = 4) {
  return filterMusicTracks(results).slice(0, count);
}

/**
 * 음악 데이터 정리
 */
export function formatTrack(track) {
  if (!track) return null;

  return {
    id: track.trackId,
    title: track.trackName,
    artist: track.artistName,
    artwork:
      track.artworkUrl100 || track.artworkUrl60 || track.artworkUrl30 || "",
    previewUrl: track.previewUrl || "",
    trackViewUrl: track.trackViewUrl || "",
    collectionName: track.collectionName || "",
    genre: track.primaryGenreName || "",
  };
}
