import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { getArtistSongs, getSearch } from "../../../api/itunes";

export default function Section_4() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendReason, setRecommendReason] = useState("당신을 위한 추천");

  useEffect(() => {
    const fetchRecommendedMusic = async () => {
      try {
        setLoading(true);

        const savedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];

        let data = null;
        let favoriteGenre = "";

        if (savedFavorites.length > 0) {
          const genreCounts = {};

          savedFavorites.forEach((track) => {
            const genre = track.genre || "Pop";
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });

          favoriteGenre = Object.keys(genreCounts).reduce((a, b) =>
            genreCounts[a] > genreCounts[b] ? a : b,
          );

          setRecommendReason(`가장 즐겨 듣는 장르 [#${favoriteGenre}]`);

          let searchQuery = favoriteGenre;
          if (favoriteGenre === "발라드") searchQuery = "발라드";
          else if (favoriteGenre === "댄스") searchQuery = "댄스";
          else if (favoriteGenre === "랩/힙합") searchQuery = "힙합";
          else if (favoriteGenre === "R&B/Soul") searchQuery = "R&B";
          else if (favoriteGenre === "인디") searchQuery = "인디";
          else if (favoriteGenre === "팝" || favoriteGenre === "Pop")
            searchQuery = "Pop";

          data = await getSearch(searchQuery);

          if (data?.results) {
            const favoriteIds = savedFavorites.map((fav) => String(fav.id));
            data.results = data.results.filter(
              (t) => !favoriteIds.includes(String(t.trackId)),
            );
          }
        }

        if (!data || !data.results || data.results.length === 0) {
          setRecommendReason("당신을 위한 추천");
          data = await getArtistSongs("아이유");
        }

        if (data && data.results) {
          const formattedTracks = data.results.slice(0, 3).map((track) => {
            const highResImage = track.artworkUrl100
              ? track.artworkUrl100.replace("100x100bb", "300x300bb")
              : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop";

            return {
              id: track.trackId || track.trackName,
              title: track.trackName,
              artist: track.artistName,
              image: highResImage,
              previewUrl: track.previewUrl || "",
              genre: track.primaryGenreName || favoriteGenre || "Pop",
            };
          });
          setTracks(formattedTracks);
        }
      } catch (err) {
        console.error("장르 기반 추천 로드 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMusic();
  }, []);

  return (
    <section className="w-full max-w-md mx-auto bg-[#0d1527] text-white px-5 py-7 mb-3 font-sans">
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-xl font-bold text-white tracking-wide">
          {recommendReason}
        </h3>
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
              className="flex items-center justify-between bg-transparent p-2 rounded-xl transition-colors cursor-pointer block group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-sm font-bold text-white line-clamp-1">
                    {track.artist}
                  </span>
                  <span className="text-xs text-slate-400 font-medium tracking-tight mt-0.5 line-clamp-1">
                    {track.title}
                  </span>
                </div>
              </div>

              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md transform active:scale-90 transition-transform">
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </button>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
