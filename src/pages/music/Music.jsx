import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Play, ArrowLeft, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { getSearch } from "../../api/itunes";
import { getArtistTopTracks, getTrackTags } from "../../api/lastfm";

export default function Music() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [track, setTrack] = useState(location.state?.track || null);
  const [detailInfo, setDetailInfo] = useState({
    album: "로딩 중...",
    genre: "분석 중...",
    releaseDate: "로딩 중...",
    previewUrl: "",
  });
  const [artistTracks, setArtistTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMusicDetails = async () => {
      setLoading(true);

      let currentTrack = location.state?.track || null;
      if (currentTrack) {
        setTrack(currentTrack);
      }

      try {
        if (!currentTrack && id) {
          const searchData = await getSearch(id);
          if (searchData?.results?.length > 0) {
            const t = searchData.results[0];
            currentTrack = {
              id: t.trackId,
              title: t.trackName,
              artist: t.artistName,
              image: t.artworkUrl100?.replace("100x100bb", "300x300bb"),
              previewUrl: t.previewUrl,
            };
            setTrack(currentTrack);
          }
        }

        if (!currentTrack) {
          setLoading(false);
          return;
        }

        // 1. iTunes 상세정보 조회
        const detailData = await getSearch(
          `${currentTrack.artist} ${currentTrack.title}`,
        );
        const info = detailData?.results?.[0];

        let determinedGenre = currentTrack?.genre;

        if (
          !determinedGenre ||
          determinedGenre === "Pop" ||
          determinedGenre === "K-Pop"
        ) {
          determinedGenre = info?.primaryGenreName || "Pop";

          try {
            const tagData = await getTrackTags(
              currentTrack.artist,
              currentTrack.title,
            );
            const tags = tagData?.toptags?.tag || [];
            const tagNames = tags.map((t) =>
              (typeof t === "string" ? t : t.name).toLowerCase(),
            );

            const matchedTag = tagNames.find((t) =>
              /ballad|발라드|hip|힙합|r&b|rnb|indie|인디|dance|댄스/i.test(t),
            );

            if (matchedTag) {
              if (/ballad|발라드/i.test(matchedTag)) determinedGenre = "발라드";
              else if (/hip|힙합/i.test(matchedTag))
                determinedGenre = "랩/힙합";
              else if (/r&b|rnb/i.test(matchedTag))
                determinedGenre = "R&B/Soul";
              else if (/indie|인디/i.test(matchedTag)) determinedGenre = "인디";
              else if (/dance|댄스/i.test(matchedTag)) determinedGenre = "댄스";
            }
          } catch (e) {
            console.warn("태그 조회 실패");
          }
        }

        const finalGenre = determinedGenre;

        setDetailInfo({
          album: info?.collectionName || "싱글 앨범",
          genre: finalGenre,
          releaseDate: info?.releaseDate
            ? info.releaseDate.split("T")[0].replace(/-/g, ".")
            : "알 수 없음",
          previewUrl: info?.previewUrl || currentTrack.previewUrl,
        });

        // 💡 로컬스토리지에 이미 좋아요 되어있는지 확인하고, 최신 장르로 업데이트
        const savedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        const found = savedFavorites.some(
          (item) => String(item.id) === String(currentTrack.id || id),
        );
        setIsLiked(found);

        // 2. 해당 가수의 다른 인기곡 조회
        try {
          const topTracksData = await getArtistTopTracks(currentTrack.artist);
          if (topTracksData?.toptracks?.track) {
            const rawTracks = topTracksData.toptracks.track;

            const hybridTracks = await Promise.all(
              rawTracks.slice(0, 10).map(async (item) => {
                if (
                  item.name.toLowerCase() === currentTrack.title.toLowerCase()
                )
                  return null;

                const res = await getSearch(
                  `${currentTrack.artist} ${item.name}`,
                );
                const t = res?.results?.[0];
                return t
                  ? {
                      id: t.trackId,
                      title: t.trackName,
                      artist: t.artistName,
                      image: t.artworkUrl100?.replace("100x100bb", "300x300bb"),
                      previewUrl: t.previewUrl,
                      genre: finalGenre,
                    }
                  : null;
              }),
            );
            const validTracks = hybridTracks.filter((t) => t !== null);
            setArtistTracks(validTracks);
          }
        } catch (e) {
          console.warn("가수 인기곡 조회 실패");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMusicDetails();
  }, [id, location.state]);

  // 상세 페이지 내 좋아요 토글 함수 (분석된 장르가 정확히 저장됨)
  const toggleLike = () => {
    if (!track) return;
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = savedFavorites.findIndex(
      (item) => String(item.id) === String(track.id),
    );

    let updatedFavorites;
    if (index >= 0) {
      updatedFavorites = savedFavorites.filter(
        (item) => String(item.id) !== String(track.id),
      );
      setIsLiked(false);
    } else {
      const newTrackItem = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        image: track.image,
        genre: detailInfo.genre, // 👈 분석 완료된 정확한 장르 저장!
      };
      updatedFavorites = [...savedFavorites, newTrackItem];
      setIsLiked(true);
    }
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (loading && !track)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        로딩 중...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white px-5 pt-6 pb-28">
      {/* 상단 버튼 및 이미지 */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-full max-w-xs flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
          >
            <ArrowLeft size={18} />
          </button>
          {/* 좋아요 버튼 추가 */}
          <button
            onClick={toggleLike}
            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition text-red-500"
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="w-64 h-64 rounded-[32px] overflow-hidden bg-slate-900 mb-6 shadow-2xl">
          <img
            src={track?.image}
            className="w-full h-full object-cover"
            alt={track?.title}
          />
        </div>
        <h1 className="text-2xl font-bold mb-1 px-4 line-clamp-1">
          {track?.title}
        </h1>
        <p className="text-sm text-slate-400 mb-5">{track?.artist}</p>
        <button
          onClick={() =>
            navigate("/music/play", {
              state: {
                track: {
                  ...track,
                  previewUrl: detailInfo.previewUrl,
                  genre: detailInfo.genre,
                },
              },
            })
          }
          className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full text-sm shadow-md transition active:scale-95"
        >
          <Play size={14} fill="currentColor" /> 미리 듣기
        </button>
      </div>

      {/* 정보 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">음악 정보</h2>
        <div className="bg-white text-slate-900 rounded-[24px] p-5 shadow-lg">
          <div className="flex flex-col gap-4 text-sm font-medium">
            <div className="flex items-center">
              <span className="text-slate-400 w-16">앨범</span>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-xs truncate max-w-[200px]">
                {detailInfo.album}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-slate-400 w-16">장르</span>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-xs">
                {detailInfo.genre}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-slate-400 w-16">발매일</span>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-xs">
                {detailInfo.releaseDate}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 가수의 다른 노래 섹션 */}
      {artistTracks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {track?.artist}의 다른 노래
          </h2>
          <Swiper
            spaceBetween={14}
            slidesPerView={2.5}
            className="!overflow-visible"
          >
            {artistTracks.map((item, index) => (
              <SwiperSlide key={`${item.id}-${index}`}>
                <Link
                  to={`/music/${item.id}`}
                  state={{ track: item }}
                  className="block"
                >
                  <div className="bg-[#1E2640] rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={item.image}
                      className="w-full aspect-square object-cover"
                      alt={item.title}
                    />
                    <div className="p-3">
                      <p className="text-xs font-bold truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.artist}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* 플리 추가 버튼 */}
      <div className="px-5 py-4 bg-slate-950/80 backdrop-blur-md bottom-0 left-0 right-0 z-20 mb-5">
        <Link
          to="/playlist"
          state={{ addTrack: { ...track, genre: detailInfo.genre } }}
          className="block w-full py-4 bg-white text-slate-900 font-bold rounded-full text-center shadow-xl active:scale-[0.99] transition"
        >
          내 playlist 추가하기 +
        </Link>
      </div>
    </div>
  );
}
