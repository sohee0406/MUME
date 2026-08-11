import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getGenreMusic } from "../../../api/itunes";

const GENRE_LIST = [
  { id: "ballad", name: "발라드", query: "발라드" },
  { id: "dance", name: "댄스", query: "댄스" },
  { id: "hiphop", name: "랩/힙합", query: "힙합" },
  { id: "rnb", name: "R&B/Soul", query: "알앤비" },
  { id: "pop", name: "팝", query: "팝" },
  { id: "rock", name: "록", query: "록" },
  { id: "indie", name: "인디", query: "인디" },
  { id: "ost", name: "OST", query: "OST" },
];

export default function Section_5() {
  const [activeGenre, setActiveGenre] = useState(GENRE_LIST[0]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenreMusic = async () => {
      setLoading(true);
      try {
        const data = await getGenreMusic(activeGenre.query);
        if (data.results) {
          const formattedTracks = data.results.slice(0, 4).map((track) => ({
            id: track.trackId || track.trackName,
            title: track.trackName,
            artist: track.artistName,
            image: track.artworkUrl100
              ? track.artworkUrl100.replace("100x100bb", "300x300bb")
              : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
            genre: activeGenre.name, // 💡 상세페이지로 장르명 전달
          }));
          setTracks(formattedTracks);
        }
      } catch (err) {
        console.error("장르 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGenreMusic();
  }, [activeGenre]);

  return (
    <section className="px-5 py-8 mb-16">
      <h2 className="text-xl font-bold text-white mb-5">장르별 탐색</h2>
      <div className="w-full mb-5">
        <Swiper
          slidesPerView="auto"
          spaceBetween={8}
          freeMode={true}
          className="w-full"
        >
          {GENRE_LIST.map((genre) => (
            <SwiperSlide key={genre.id} className="!w-auto">
              <button
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeGenre.id === genre.id
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {genre.name}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 bg-slate-800/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tracks.map((track) => (
            <Link
              key={track.id}
              to={`/music/${track.id}`}
              state={{ track }}
              className="flex items-center justify-between bg-transparent p-2 rounded-xl"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-sm font-bold text-white line-clamp-1">
                    {track.artist}
                  </span>
                  <span className="text-xs text-slate-400 font-medium tracking-tight mt-0.5 line-clamp-1">
                    {track.title}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md flex-shrink-0">
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
