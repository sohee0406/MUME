import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import PageTitle from "../../components/PageTitle";

export default function MyTaste() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [topGenre, setTopGenre] = useState("K-pop");
  const [topArtist, setTopArtist] = useState("데이터 없음");
  const [favoriteGenres, setFavoriteGenres] = useState([
    "K-pop",
    "발라드",
    "rock",
  ]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    setFavorites(savedFavorites);

    if (savedFavorites.length > 0) {
      const genreCounts = {};
      const artistCounts = {};

      savedFavorites.forEach((song) => {
        const genre = song.genre || "K-pop";
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;

        const artist = song.artist || "알 수 없음";
        artistCounts[artist] = (artistCounts[artist] || 0) + 1;
      });

      const sortedGenres = Object.entries(genreCounts).sort(
        (a, b) => b[1] - a[1],
      );

      if (sortedGenres.length > 0) {
        setTopGenre(sortedGenres[0][0]);

        setFavoriteGenres(sortedGenres.slice(0, 3).map((item) => item[0]));
      }

      const sortedArtists = Object.entries(artistCounts).sort(
        (a, b) => b[1] - a[1],
      );

      if (sortedArtists.length > 0) {
        setTopArtist(sortedArtists[0][0]);
      }
    }
  }, []);

  return (
    <>
      <PageTitle title="MY TASTE" />

      <div className="flex flex-col min-h-screen bg-[#0B0F19] text-white max-w-md mx-auto relative font-sans pb-28">
        <div className="px-6 mt-4 mb-6">
          <h2 className="text-[28px] font-bold tracking-tight mb-1">
            MY TASTE
          </h2>

          <p className="text-slate-400 text-sm font-medium">
            좋아요로 분석한 나의 음악 취향
          </p>
        </div>

        <div className="px-5 space-y-3 mb-5">
          <div className="bg-[#1E2538] border border-white/5 rounded-[20px] p-4 shadow-lg">
            <p className="text-[11px] text-slate-400 font-medium mb-1">
              가장 좋아하는 장르
            </p>

            <p className="text-[17px] font-bold text-white tracking-wide">
              {topGenre}
            </p>
          </div>

          <div className="bg-[#1E2538] border border-white/5 rounded-[20px] p-4 shadow-lg">
            <p className="text-[11px] text-slate-400 font-medium mb-1">
              많이 좋아한 아티스트
            </p>

            <p className="text-[17px] font-bold text-white tracking-wide">
              {topArtist}
            </p>
          </div>
        </div>

        <div className="px-5 mb-6">
          <div className="bg-white rounded-[24px] p-5 text-slate-900 shadow-xl">
            <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold mb-2">
              <Heart size={16} fill="currentColor" />

              <span>좋아요한 음악</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-bold tracking-tight">
                {favorites.length}
              </span>

              <span className="text-sm font-bold text-slate-700">곡</span>
            </div>
          </div>
        </div>

        <div className="px-5 mb-8">
          <button
            onClick={() => navigate("/recommend")}
            className="w-full py-4 bg-white text-slate-900 font-bold rounded-full text-center shadow-lg active:scale-[0.99] transition"
          >
            내 상황에 맞는 음악 추천받기
          </button>
        </div>

        <div className="px-6 mb-6">
          <h3 className="text-base font-bold mb-3">Favorite Genre</h3>

          <div className="flex items-center gap-2 flex-wrap">
            {favoriteGenres.map((genre, index) => (
              <span
                key={index}
                className="px-5 py-2 bg-white text-slate-900 rounded-full text-xs font-bold shadow-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="pl-6">
          <h3 className="text-base font-bold mb-3">My Favorite Music</h3>

          {favorites.length === 0 ? (
            <div className="pr-6 py-8 text-center text-xs text-slate-500 font-medium bg-white/5 rounded-2xl mr-5">
              아직 좋아요 표시한 음악이 없습니다.
            </div>
          ) : (
            <Swiper
              spaceBetween={14}
              slidesPerView={2.2}
              className="!overflow-visible pr-5"
            >
              {favorites.map((song, index) => (
                <SwiperSlide key={`${song.id}-${index}`}>
                  <div
                    onClick={() =>
                      navigate(`/music/${song.id}`, {
                        state: { track: song },
                      })
                    }
                    className="bg-[#ffffff28] rounded-[22px] p-3 shadow-md cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-slate-200 mb-2.5">
                      {song.image ? (
                        <img
                          src={song.image}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-300" />
                      )}
                    </div>

                    <h4 className="text-[13px] font-bold text-white truncate">
                      {song.artist}
                    </h4>

                    <p className="text-[11px] text-slate-300 truncate mt-0.5">
                      {song.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </>
  );
}
