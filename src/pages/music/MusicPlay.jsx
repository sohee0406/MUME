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
  Loader2,
  X,
} from "lucide-react";

import { getSearch } from "../../api/itunes";
import PageTitle from "../../components/PageTitle";

export default function MusicPlay() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [track, setTrack] = useState(location.state?.track || null);

  // 미리듣기 음원 주소
  const [previewUrl, setPreviewUrl] = useState("");

  // 미리듣기 음원 확인 중인지
  const [previewLoading, setPreviewLoading] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // 음원 없음 팝업
  const [showNoPreviewModal, setShowNoPreviewModal] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMusicDetails = async () => {
      setLoading(true);
      setPreviewLoading(true);

      try {
        let currentTrack = location.state?.track || track;

        // 전달받은 음악 정보가 있는 경우
        if (currentTrack) {
          setTrack(currentTrack);
        }

        // URL로 직접 접근한 경우
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

        // 음악 자체가 없는 경우
        if (!currentTrack) {
          setLoading(false);
          setPreviewLoading(false);
          return;
        }

        /*
         * 1. 이전 페이지에서 전달받은 previewUrl을 먼저 사용
         */
        let finalPreviewUrl = currentTrack.previewUrl || "";

        /*
         * 2. previewUrl이 없으면 iTunes에서 다시 검색
         */
        if (!finalPreviewUrl) {
          try {
            const detailData = await getSearch(
              `${currentTrack.artist} ${currentTrack.title}`,
            );

            finalPreviewUrl = detailData?.results?.[0]?.previewUrl || "";
          } catch (error) {
            console.error("미리듣기 음원 조회 실패:", error);
            finalPreviewUrl = "";
          }
        }

        setPreviewUrl(finalPreviewUrl);

        /*
         * 음원 조회가 끝났으므로 로딩 종료
         */
        setPreviewLoading(false);

        // 좋아요 상태 확인
        const savedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];

        setIsLiked(
          savedFavorites.some(
            (fav) => String(fav.id) === String(currentTrack.id),
          ),
        );
      } catch (err) {
        console.error("데이터 로드 실패:", err);

        setPreviewUrl("");
        setPreviewLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicDetails();

    // 페이지를 나갈 때 오디오 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
    };
  }, [id, location.state]);

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
  const togglePlay = async () => {
    /*
     * 아직 음원을 확인하는 중이면 아무 동작도 하지 않음
     */
    if (previewLoading) {
      return;
    }

    /*
     * 음원이 없는 경우 팝업 표시
     */
    if (!previewUrl) {
      setShowNoPreviewModal(true);
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      setShowNoPreviewModal(true);
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("음원 재생 실패:", error);

      setIsPlaying(false);

      setShowNoPreviewModal(true);
    }
  };

  // 재생 위치 변경
  const handleProgressChange = (e) => {
    if (!previewUrl) return;

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

        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />

          <p className="text-sm text-slate-400">MUME 플레이어 로딩 중...</p>
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
      <PageTitle title="MUSICPLAYER" />

      <div className="min-h-screen bg-slate-950 text-white px-5 pt-6 pb-10 flex flex-col items-center">
        {/* 오디오 */}
        {previewUrl && (
          <audio
            ref={audioRef}
            src={previewUrl}
            preload="metadata"
            playsInline
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
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(Math.min(audioRef.current.currentTime, 30));
              }
            }}
            onPlay={() => {
              setIsPlaying(true);
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
            onError={(e) => {
              console.error("오디오 로드 오류:", e);

              setIsPlaying(false);
              setPreviewUrl("");
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
            disabled={!previewUrl || previewLoading}
            className={`w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 ${
              !previewUrl || previewLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
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
          {/* 이전 */}
          <button
            type="button"
            className="text-slate-300 hover:text-white transition active:scale-95"
          >
            <SkipBack size={32} fill="currentColor" />
          </button>

          {/* 중앙 재생 버튼 */}
          <button
            type="button"
            onClick={togglePlay}
            className={`w-16 h-16 flex items-center justify-center rounded-full transition active:scale-95 shadow-lg ${
              previewLoading
                ? "bg-slate-600 text-slate-400 cursor-wait"
                : previewUrl
                  ? "bg-white text-slate-900 hover:scale-105"
                  : "bg-slate-600 text-slate-300"
            }`}
          >
            {previewLoading ? (
              <Loader2 size={26} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play size={28} fill="currentColor" className="ml-1" />
            )}
          </button>

          {/* 다음 */}
          <button
            type="button"
            className="text-slate-300 hover:text-white transition active:scale-95"
          >
            <SkipForward size={32} fill="currentColor" />
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-10">
          <RefreshCw size={12} />

          <span>
            {previewLoading
              ? "미리듣기 음원을 확인하고 있습니다"
              : previewUrl
                ? "30초 미리듣기가 제공됩니다"
                : "미리듣기 음원이 제공되지 않습니다"}
          </span>
        </div>
      </div>

      {/* 음원 없음 팝업 */}
      {showNoPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[28px] p-6 shadow-2xl">
            {/* 닫기 */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowNoPreviewModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* 내용 */}
            <div className="flex flex-col items-center text-center px-3 pb-3">
              <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                <Play
                  size={24}
                  className="text-slate-400"
                  fill="currentColor"
                />
              </div>

              <h2 className="text-lg font-bold text-white mb-2">
                미리듣기 음원이 없습니다
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                아쉽지만 이 음악은
                <br />
                iTunes에서 제공하는 미리듣기 음원이 없습니다.
              </p>

              <button
                type="button"
                onClick={() => setShowNoPreviewModal(false)}
                className="w-full mt-6 py-3.5 bg-white text-slate-900 rounded-full font-bold text-sm active:scale-95 transition"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
