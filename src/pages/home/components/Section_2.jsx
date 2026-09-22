import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

import { getArtistSongs } from "../../../api/itunes";

const K_CHART_ARTISTS = [
  "뉴진스",
  "아이유",
  "에스파",
  "데이식스",
  "아이브",
  "르세라핌",
];

export default function Section_2() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKoreanTopTracks = async () => {
      try {
        const promises = K_CHART_ARTISTS.map(async (artist) => {
          try {
            const data = await getArtistSongs(artist);

            if (data.results && data.results.length > 0) {
              const topTrack = data.results[0];

              const highResImage = topTrack.artworkUrl100
                ? topTrack.artworkUrl100.replace("100x100bb", "300x300bb")
                : "";

              return {
                id: topTrack.trackId,
                title: topTrack.trackName,
                artist: topTrack.artistName,
                image: highResImage,
              };
            }
          } catch (err) {
            console.error(`${artist} 곡 로드 실패:`, err);
          }

          return null;
        });

        const resolvedTracks = await Promise.all(promises);
        const validTracks = resolvedTracks.filter((track) => track !== null);

        setTracks(validTracks);
      } catch (err) {
        console.error("한국 인기 순위 로드 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKoreanTopTracks();
  }, []);

  return (
    <section className="w-full max-w-full overflow-hidden bg-[#0d1527] text-white px-4 py-7 mb-3 font-sans">
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-xl font-bold text-white tracking-wide">
          오늘의 MUSIC
        </h3>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden w-full">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-[130px] flex-shrink-0">
              <div className="w-[130px] h-[130px] bg-slate-800/50 animate-pulse rounded-xl" />

              <div className="mt-2">
                <div className="w-20 h-3 bg-slate-800/50 animate-pulse rounded" />
                <div className="w-14 h-2.5 bg-slate-800/50 animate-pulse rounded mt-1.5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-full overflow-hidden">
          <Swiper
            spaceBetween={12}
            slidesPerView={2.2}
            slidesOffsetAfter={0}
            className="!w-full !overflow-visible"
          >
            {tracks.map((track) => (
              <SwiperSlide key={track.id} className="!w-[130px] !flex-shrink-0">
                <Link
                  to={`/music/${track.id}`}
                  state={{ track }}
                  className="block w-[130px]"
                >
                  {/* 앨범 이미지 */}
                  <div className="relative w-[130px] h-[130px] rounded-xl overflow-hidden cursor-pointer shadow-md bg-slate-900 flex items-center justify-center">
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

                    {/* 이미지 없음 */}
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
                  </div>

                  {/* 곡 정보 */}
                  <div className="mt-2 px-0.5 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {track.title}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      {track.artist}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
}
