import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Play, Heart, X, CheckCircle2, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { getSearch } from "../../api/itunes";
import { getArtistTopTracks, getTrackTags } from "../../api/lastfm";
import { useScrollTop } from "../../lib/useScrollTop";
import PageTitle from "../../components/PageTitle";

export default function Music() {
  useScrollTop();

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [track, setTrack] = useState(location.state?.track || null);

  const [detailInfo, setDetailInfo] = useState({
    album: "",
    genre: "",
    releaseDate: "",
    previewUrl: "",
  });

  const [artistTracks, setArtistTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  useEffect(() => {
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
              previewUrl: t.previewUrl || "",
            };

            setTrack(currentTrack);
          }
        }

        if (!currentTrack) {
          setLoading(false);
          return;
        }

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
              if (/ballad|발라드/i.test(matchedTag)) {
                determinedGenre = "발라드";
              } else if (/hip|힙합/i.test(matchedTag)) {
                determinedGenre = "랩/힙합";
              } else if (/r&b|rnb/i.test(matchedTag)) {
                determinedGenre = "R&B/Soul";
              } else if (/indie|인디/i.test(matchedTag)) {
                determinedGenre = "인디";
              } else if (/dance|댄스/i.test(matchedTag)) {
                determinedGenre = "댄스";
              }
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

          previewUrl: info?.previewUrl || currentTrack.previewUrl || "",
        });

        const savedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];

        const found = savedFavorites.some(
          (item) => String(item.id) === String(currentTrack.id || id),
        );

        setIsLiked(found);

        try {
          const topTracksData = await getArtistTopTracks(currentTrack.artist);

          if (topTracksData?.toptracks?.track) {
            const rawTracks = topTracksData.toptracks.track;

            const hybridTracks = await Promise.all(
              rawTracks.slice(0, 10).map(async (item) => {
                if (
                  item.name.toLowerCase() === currentTrack.title.toLowerCase()
                ) {
                  return null;
                }

                try {
                  const res = await getSearch(
                    `${currentTrack.artist} ${item.name}`,
                  );

                  const t = res?.results?.[0];

                  if (!t) return null;

                  return {
                    id: t.trackId,
                    title: t.trackName,
                    artist: t.artistName,
                    image: t.artworkUrl100?.replace("100x100bb", "300x300bb"),
                    previewUrl: t.previewUrl || "",
                    genre: finalGenre,
                  };
                } catch (error) {
                  return null;
                }
              }),
            );

            setArtistTracks(hybridTracks.filter((t) => t !== null));
          }
        } catch (e) {
          console.warn("가수 인기곡 조회 실패");
        }
      } catch (e) {
        console.error("음악 상세 정보 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicDetails();
  }, [id, location.state]);

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
        genre: detailInfo.genre,
      };

      updatedFavorites = [...savedFavorites, newTrackItem];

      setIsLiked(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleOpenPlaylistModal = () => {
    const saved = JSON.parse(localStorage.getItem("mume_playlists")) || [];

    setMyPlaylists(saved);
    setIsModalOpen(true);
  };

  const handleAddSongToPlaylist = (playlist) => {
    if (!track) return;

    const alreadyExists = (playlist.songs || []).some(
      (song) => String(song.id) === String(track.id),
    );

    if (alreadyExists) {
      setIsModalOpen(false);

      triggerToast(`"${playlist.title}"에 이미 추가된 곡입니다.`);

      return;
    }

    const songToAdd = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      image: track.image,
      previewUrl: detailInfo.previewUrl || "",
      genre: detailInfo.genre || "Pop",
    };

    const updatedSongs = [...(playlist.songs || []), songToAdd];

    const updatedPlaylist = {
      ...playlist,
      songs: updatedSongs,
    };

    const allPlaylists = myPlaylists.map((pl) =>
      String(pl.id) === String(playlist.id) ? updatedPlaylist : pl,
    );

    localStorage.setItem("mume_playlists", JSON.stringify(allPlaylists));

    setMyPlaylists(allPlaylists);

    setIsModalOpen(false);

    triggerToast(`"${playlist.title}" 플레이리스트에 곡이 추가되었습니다!`);
  };

  if (loading && !track) {
    return (
      <>
        <PageTitle title="MUSIC" />

        <div className="flex-1 bg-slate-950 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </>
    );
  }

  if (!track) {
    return (
      <>
        <PageTitle title="MUSIC" />

        <div className="flex-1 bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-xl font-bold mb-2">음악을 찾을 수 없습니다.</h2>

          <p className="text-sm text-slate-400 mb-6">
            음악 정보가 존재하지 않거나
            <br />
            잘못된 주소로 접근하셨습니다.
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-white text-slate-900 rounded-full text-sm font-bold active:scale-95 transition"
          >
            홈으로
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title="MUSIC" />

      <div className="min-h-screen bg-slate-950 text-white px-5 pt-12 pb-28 relative">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-64 h-64 rounded-[32px] overflow-hidden bg-slate-900 mb-6 shadow-2xl">
            <img
              src={track.image}
              className="w-full h-full object-cover"
              alt={track.title}
            />
          </div>

          <h1 className="text-2xl font-bold mb-1 px-4 line-clamp-1">
            {track.title}
          </h1>

          <p className="text-sm text-slate-400 mb-6">{track.artist}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate("/music/play", {
                  state: {
                    track: {
                      ...track,
                      previewUrl:
                        detailInfo.previewUrl || track.previewUrl || "",
                      genre: detailInfo.genre || track.genre || "Pop",
                    },
                  },
                })
              }
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full text-sm shadow-md transition active:scale-95"
            >
              <Play size={14} fill="currentColor" />
              미리 듣기
            </button>

            <button
              onClick={toggleLike}
              className="text-gray-200 transition active:scale-95"
            >
              <Heart
                size={26}
                fill={isLiked ? "red" : "none"}
                stroke={isLiked ? "red" : "currentColor"}
              />
            </button>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 ml-1">음악 정보</h2>

          <div className="bg-white/5 border border-white/10 rounded-[24px] p-5">
            <div className="flex flex-col gap-4 text-sm font-medium">
              <div className="flex items-center">
                <span className="text-slate-400 w-16">앨범</span>

                <span className="bg-white/5 px-3 py-1 rounded-full text-xs truncate max-w-[200px] text-slate-200">
                  {detailInfo.album ? (
                    detailInfo.album
                  ) : (
                    <Loader2 className="w-3 h-3 animate-spin inline text-slate-400" />
                  )}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-slate-400 w-16">장르</span>

                <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-slate-200">
                  {detailInfo.genre ? (
                    detailInfo.genre
                  ) : (
                    <Loader2 className="w-3 h-3 animate-spin inline text-slate-400" />
                  )}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-slate-400 w-16">발매일</span>

                <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-slate-200">
                  {detailInfo.releaseDate ? (
                    detailInfo.releaseDate
                  ) : (
                    <Loader2 className="w-3 h-3 animate-spin inline text-slate-400" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {artistTracks.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4 ml-1">
              {track.artist}의 다른 노래
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
                        <p className="text-xs font-bold truncate">
                          {item.title}
                        </p>

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

        <div className="px-5 py-4 bg-slate-950/80 backdrop-blur-md bottom-0 left-0 right-0 z-20">
          <button
            onClick={handleOpenPlaylistModal}
            className="block w-full py-4 bg-white text-slate-900 font-bold rounded-full text-center shadow-xl active:scale-[0.99] transition"
          >
            내 playlist 추가하기 +
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md h-[50vh] bg-slate-900 rounded-t-[32px] p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-white">
                  플레이리스트 선택
                </h2>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {myPlaylists.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                    생성된 플레이리스트가 없습니다.
                  </div>
                ) : (
                  myPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => handleAddSongToPlaylist(pl)}
                      className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                        {pl.coverImage ? (
                          <img
                            src={pl.coverImage}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-700" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-white truncate">
                          {pl.title}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {pl.songs?.length || 0}곡
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none ${
            showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-900/95 border border-white/10 text-white text-xs font-semibold rounded-full shadow-2xl backdrop-blur-md">
            <CheckCircle2 size={30} className="text-blue-500" />

            <span>{toastMessage}</span>
          </div>
        </div>
      </div>
    </>
  );
}
