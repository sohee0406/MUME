import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSearch } from "../../../api/itunes";

export default function Section_3() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMusic = async () => {
      try {
        const data = await getSearch("댄스");

        if (data.results) {
          const formattedTracks = data.results.slice(0, 4).map((track) => {
            const highResImage = track.artworkUrl100
              ? track.artworkUrl100.replace("100x100bb", "300x300bb")
              : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop";

            return {
              id: track.trackId || track.trackName,
              title: track.trackName,
              artist: track.artistName,
              image: highResImage,
            };
          });

          setTracks(formattedTracks);
        }
      } catch (err) {
        console.error("지금 인기있는 음악 로드 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMusic();
  }, []);

  return (
    <section className="px-5 py-8">
      {/* 타이틀 영역 */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">🔥 지금 인기있는 음악</h2>
      </div>

      {/* 로딩 UI */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-48 bg-slate-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {tracks.map((track) => (
            <Link
              key={track.id}
              to={`/music/${track.id}`}
              state={{ track }}
              className="bg-white rounded-2xl p-3 flex flex-col gap-2.5 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
            >
              {/* 이미지 */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 텍스트 */}
              <div className="px-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-slate-900 line-clamp-1">
                  {track.artist}
                </span>

                <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 line-clamp-1">
                  {track.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
