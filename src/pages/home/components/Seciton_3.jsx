import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MELON_TOP4 = [
  {
    id: "melon-1",
    rank: 1,
    title: "퇴사할게여 (Narr. 기안84)",
    artist: "소연 (SOYEON)",
    image: "",
    genre: "K-Pop",
  },
  {
    id: "melon-2",
    rank: 2,
    title: "LOVE ATTACK",
    artist: "RESCENE",
    image: "",
    genre: "K-Pop",
  },
  {
    id: "melon-3",
    rank: 3,
    title: "갑자기",
    artist: "아이오아이 (I.O.I)",
    image: "",
    genre: "K-Pop",
  },
  {
    id: "melon-4",
    rank: 4,
    title: "Deja Vu",
    artist: "RESCENE",
    image: "",
    genre: "K-Pop",
  },
];

export default function Section_3() {
  const [tracks, setTracks] = useState(MELON_TOP4);

  useEffect(() => {
    const loadAlbumImages = async () => {
      const updatedTracks = await Promise.all(
        MELON_TOP4.map(async (track) => {
          try {
            const searchUrl = new URL("https://itunes.apple.com/search");

            searchUrl.searchParams.set(
              "term",
              `${track.artist} ${track.title}`,
            );
            searchUrl.searchParams.set("country", "KR");
            searchUrl.searchParams.set("media", "music");
            searchUrl.searchParams.set("limit", "10");

            const response = await fetch(searchUrl);

            if (!response.ok) {
              return track;
            }

            const data = await response.json();

            const result =
              data?.results?.find(
                (item) =>
                  item?.artworkUrl100 && item?.artistName && item?.trackName,
              ) || data?.results?.[0];

            if (!result?.artworkUrl100) {
              return track;
            }

            return {
              ...track,
              image: result.artworkUrl100.replace("100x100bb", "600x600bb"),
            };
          } catch (error) {
            console.error(`${track.title} 이미지 로드 실패:`, error);

            return track;
          }
        }),
      );

      setTracks(updatedTracks);
    };

    loadAlbumImages();
  }, []);

  return (
    <section className="px-5 py-7">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">지금 인기있는 음악</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tracks.map((track) => (
          <Link
            key={track.id}
            to={`/music/${track.id}`}
            state={{ track }}
            className="bg-[#ffffff1f] rounded-2xl p-3 flex flex-col gap-2.5 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
          >
            {/* 앨범 이미지 */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
              {track.image ? (
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";

                    const fallback =
                      e.currentTarget.parentElement.querySelector(
                        ".image-fallback",
                      );

                    if (fallback) {
                      fallback.classList.remove("hidden");
                    }
                  }}
                />
              ) : null}

              {/* 이미지가 없거나 로딩 실패했을 때 */}
              <div
                className={`image-fallback absolute inset-0 flex items-center justify-center ${
                  track.image ? "hidden" : ""
                }`}
              >
                <span className="text-xs text-slate-500 text-center">
                  이미지
                  <br />
                  없음
                </span>
              </div>

              {/* 순위 */}
              <div className="absolute top-2 left-2 min-w-7 h-7 px-2 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {track.rank}
                </span>
              </div>
            </div>

            {/* 곡 정보 */}
            <div className="px-1 flex flex-col justify-center min-w-0">
              <span className="text-xs font-bold text-white line-clamp-1">
                {track.artist}
              </span>

              <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 line-clamp-1">
                {track.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
