import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Plus,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
} from "lucide-react";
import { getSearch } from "../../api/itunes";
import PageTitle from "../../components/PageTitle";

export default function MusicPlayer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [track, setTrack] = useState(location.state?.track || null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMusicDetails = async () => {
      setLoading(true);

      try {
        let currentTrack = track;

        if (!currentTrack && id) {
          const searchData = await getSearch(id);

          if (searchData?.results?.length > 0) {
            const t = searchData.results[0];

            currentTrack = {
              id: t.trackId,
              title: t.trackName,
              artist: t.artistName,
              image: t.artworkUrl100
                ? t.artworkUrl100.replace("100x100bb", "600x600bb")
                : "",
              previewUrl: t.previewUrl || "",
            };

            setTrack(currentTrack);
          }
        }

        if (currentTrack) {
          const detailData = await getSearch(
            `${currentTrack.artist} ${currentTrack.title}`,
          );

          setPreviewUrl(
            detailData?.results?.[0]?.previewUrl ||
              currentTrack.previewUrl ||
              "",
          );

          const savedFavorites =
            JSON.parse(localStorage.getItem("favorites")) || [];

          setIsLiked(
            savedFavorites.some(
              (fav) => String(fav.id) === String(currentTrack.id),
            ),
          );
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicDetails();
  }, [id, track]);

  // 좋아요
  const handleLikeToggle = () => {
    if (!track) return;

    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isLiked) {
      const updatedFavorites = savedFavorites.filter(
        (fav) => String(fav.id) !== String(track.id),
      );

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      setIsLiked(false);
    } else {
      const newFavorite = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        image: track.image,
        previewUrl: previewUrl || track.previewUrl || "",
      };

      const updatedFavorites = [...savedFavorites, newFavorite];

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      setIsLiked(true);
    }
  };

  // 재생 / 일시정지
  const togglePlay = () => {
    if (!previewUrl) {
      alert("제공되는 미리듣기 음원이 없습니다.");
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          alert("재생에 실패했습니다.");
        });
    }
  };

  // 재생 위치 변경
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);

    setCurrentTime(newTime);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 시간 표시
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 로딩 화면
  if (loading && !track) {
    return (
      <>
        <PageTitle title="MUSICPLAYER" />

        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          MUME 플레이어 로딩 중...
        </div>
      </>
    );
  }

  // 음악 정보가 없는 경우
  if (!track) {
    return (
      <>
        <PageTitle title="MUSICPLAYER" />

        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
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
      {/* 브라우저 탭 제목 */}
      <PageTitle title="MUSICPLAYER" />

      <div className="min-h-screen bg-slate-950 text-white px-5 pt-6 pb-10 flex flex-col items-center">
        {/* 오디오 */}
        {previewUrl && (
          <audio
            ref={audioRef}
            src={previewUrl}
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                const audioDuration = audioRef.current.duration;

                setDuration(
                  Number.isFinite(audioDuration) && audioDuration > 0
                    ? Math.min(audioDuration, 30)
                    : 30,
                );
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />
        )}

        {/* 좋아요 / 담기 */}
        <div className="w-full max-w-sm flex gap-2.5 mb-5 justify-start items-center pl-1">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full transition ${
              isLiked
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-700/50 hover:bg-slate-600 text-slate-200"
            }`}
          >
            <Heart
              size={12}
              fill={isLiked ? "#FFFFFF" : "none"}
              className={isLiked ? "text-white" : "text-slate-300"}
            />

            <span>좋아요</span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/playlist", {
                state: {
                  selectedTrack: {
                    ...track,
                    previewUrl: previewUrl || track.previewUrl || "",
                  },
                },
              })
            }
            className="flex items-center gap-1 px-3 py-1 bg-slate-700/50 hover:bg-slate-600 text-xs text-slate-200 rounded-full transition"
          >
            <Plus size={12} className="text-slate-300" />

            <span>담기</span>
          </button>
        </div>

        {/* 앨범 이미지 */}
        <div className="w-full aspect-square max-w-sm rounded-[32px] overflow-hidden bg-slate-800 shadow-2xl mb-8">
          <img
            src={
              track?.image ||
              "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600"
            }
            alt={track?.title || "음악"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 음악 제목 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2 px-4 line-clamp-1">
            {track?.title || "음악 이름"}
          </h2>

          <p className="text-sm text-slate-400 font-medium">
            {track?.artist || "가수 이름"}
          </p>
        </div>

        {/* 재생바 */}
        <div className="w-full max-w-sm flex flex-col mb-10">
          <input
            type="range"
            min="0"
            max={duration}
            value={Math.min(currentTime, duration)}
            onChange={handleProgressChange}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            style={{
              background: `linear-gradient(
                to right,
                #3B82F6 0%,
                #3B82F6 ${duration ? (currentTime / duration) * 100 : 0}%,
                #475569 ${duration ? (currentTime / duration) * 100 : 0}%,
                #475569 100%
              )`,
            }}
          />

          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 재생 버튼 */}
        <div className="w-full max-w-xs flex items-center justify-between mb-8">
          <button
            type="button"
            className="text-slate-300 hover:text-white transition active:scale-95"
          >
            <SkipBack size={32} fill="currentColor" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-white text-slate-900 rounded-full hover:scale-105 transition active:scale-95 shadow-lg"
          >
            {isPlaying ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play size={28} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button
            type="button"
            className="text-slate-300 hover:text-white transition active:scale-95"
          >
            <SkipForward size={32} fill="currentColor" />
          </button>
        </div>

        {/* 30초 미리듣기 안내 */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-10">
          <RefreshCw size={12} />

          <span>30초 미리듣기가 제공됩니다</span>
        </div>
      </div>
    </>
  );
}
