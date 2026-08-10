import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { getSearch } from "../../api/itunes";

export default function Music() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [track, setTrack] = useState(location.state?.track || null);

  const [detailInfo, setDetailInfo] = useState({
    album: "로드 중...",
    genre: "로드 중...",
    releaseDate: "로드 중...",
    previewUrl: "",
  });

  const [similarTracks, setSimilarTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusicDetails = async () => {
      setLoading(true);

      try {
        let currentTrack = location.state?.track || null;

        /* 전달받은 음악 정보가 없으면 ID로 검색 */
        if (!currentTrack && id) {
          const searchData = await getSearch(id);

          if (searchData?.results && searchData.results.length > 0) {
            const t = searchData.results[0];

            currentTrack = {
              id: t.trackId,
              title: t.trackName,
              artist: t.artistName,
              image: t.artworkUrl100
                ? t.artworkUrl100.replace("100x100bb", "300x300bb")
                : "",
              previewUrl: t.previewUrl || "",
            };

            setTrack(currentTrack);
          }
        }

        if (!currentTrack) {
          setLoading(false);
          return;
        }

        setTrack(currentTrack);

        /* 음악 상세 정보 */
        const detailData = await getSearch(
          `${currentTrack.artist} ${currentTrack.title}`,
        );

        let fetchedGenre = "Pop";

        if (detailData?.results && detailData.results.length > 0) {
          const info = detailData.results[0];

          fetchedGenre = info.primaryGenreName || "Pop";

          const formattedDate = info.releaseDate
            ? info.releaseDate.split("T")[0].replace(/-/g, ".")
            : "알 수 없음";

          setDetailInfo({
            album: info.collectionName || "싱글 앨범",
            genre: fetchedGenre,
            releaseDate: formattedDate,
            previewUrl: info.previewUrl || currentTrack.previewUrl || "",
          });
        }

        /* 비슷한 음악 */
        const genreData = await getSearch(fetchedGenre);

        if (genreData?.results && genreData.results.length > 0) {
          const filteredTracks = genreData.results
            .filter((item) => String(item.trackId) !== String(currentTrack.id))
            .filter((item) => item.trackName && item.artistName)
            .slice(0, 8)
            .map((item) => ({
              id: item.trackId,
              title: item.trackName,
              artist: item.artistName,
              image: item.artworkUrl100
                ? item.artworkUrl100.replace("100x100bb", "300x300bb")
                : "",
              previewUrl: item.previewUrl || "",
            }));

          setSimilarTracks(filteredTracks);
        } else {
          setSimilarTracks([]);
        }
      } catch (error) {
        console.error("음악 상세 정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicDetails();
  }, [id, location.state]);

  /* =========================
     30초 미리듣기 페이지 이동
  ========================= */

  const handlePreview = () => {
    navigate("/music/play", {
      state: {
        track: {
          ...track,
          previewUrl: detailInfo.previewUrl || track?.previewUrl || "",
        },
      },
    });
  };

  /* 로딩 */
  if (loading && !track) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        음악 정보 로딩 중...
      </div>
    );
  }

  /* 음악 정보가 없을 때 */
  if (!track) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <p className="mb-4">음악 정보를 찾을 수 없습니다.</p>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-white text-slate-900 rounded-full font-bold"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-5 pt-6 pb-10">
      {/* =========================
          메인 음악
      ========================= */}

      <div className="flex flex-col items-center text-center mb-8">
        {/* 앨범 커버 */}
        <div className="w-64 h-64 rounded-[32px] overflow-hidden shadow-2xl bg-slate-900 mb-6">
          <img
            src={track.image}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 음악 제목 */}
        <h1 className="text-2xl font-bold mb-1 px-4 line-clamp-1">
          {track.title}
        </h1>

        {/* 가수 */}
        <p className="text-sm text-slate-300 font-medium mb-5">
          {track.artist}
        </p>

        {/* 30초 미리듣기 */}
        <button
          onClick={handlePreview}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-white text-black font-bold rounded-full text-sm shadow-md transition-transform active:scale-95"
        >
          <Play size={14} fill="currentColor" />

          <span>30초 미리 듣기</span>
        </button>
      </div>

      {/* =========================
          음악 정보
      ========================= */}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">음악 정보</h2>

        <div className="bg-white text-slate-900 rounded-[24px] p-5 shadow-lg">
          <div className="flex flex-col gap-4 text-sm font-medium">
            {/* 앨범 */}
            <div className="flex items-center min-w-0">
              <span className="text-slate-400 w-16 flex-shrink-0">앨범</span>

              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs max-w-[220px] truncate">
                {detailInfo.album}
              </span>
            </div>

            {/* 장르 */}
            <div className="flex items-center">
              <span className="text-slate-400 w-16 flex-shrink-0">장르</span>

              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs">
                {detailInfo.genre}
              </span>
            </div>

            {/* 발매일 */}
            <div className="flex items-center">
              <span className="text-slate-400 w-16 flex-shrink-0">발매일</span>

              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs">
                {detailInfo.releaseDate}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          비슷한 음악
      ========================= */}

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">비슷한 음악</h2>

        <Swiper
          spaceBetween={14}
          slidesPerView={2.5}
          className="!overflow-visible"
        >
          {similarTracks.map((item) => (
            <SwiperSlide key={item.id}>
              <Link
                to={`/music/${item.id}`}
                state={{
                  track: item,
                }}
                className="flex flex-col bg-[#1E2640] rounded-2xl overflow-hidden shadow-md hover:bg-[#252F4D] transition-colors"
              >
                {/* 앨범 커버 */}
                <div className="w-full aspect-square bg-slate-800">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* 제목 → 가수 */}
                <div className="p-3 flex flex-col justify-center min-h-[60px]">
                  <span className="text-xs font-bold text-white truncate">
                    {item.title}
                  </span>

                  <span className="text-[11px] text-slate-400 truncate mt-0.5">
                    {item.artist}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* =========================
          플레이리스트 추가
      ========================= */}

      <div className="w-full mt-auto pt-4 mb-16">
        <button
          onClick={() => alert("내 플레이리스트에 추가되었습니다! ➕")}
          className="w-full py-4 bg-[#E2E8F0] text-slate-900 font-bold rounded-full text-base transition-transform active:scale-95 shadow-lg"
        >
          내 playlist 추가하기 +
        </button>
      </div>
    </div>
  );
}
