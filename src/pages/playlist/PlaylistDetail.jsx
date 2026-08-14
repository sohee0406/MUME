import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoreHorizontal,
  Heart,
  Shuffle,
  Play,
  Trash2,
  X,
  Edit3,
} from "lucide-react";
import { useScrollTop } from "../../lib/useScrollTop";
import PageTitle from "../../components/PageTitle";

export default function PlaylistDetail() {
  useScrollTop();

  const navigate = useNavigate();
  const { id } = useParams();

  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("mume_playlists");

    if (!savedPlaylists) {
      setCurrentPlaylist(null);
      return;
    }

    try {
      const playlists = JSON.parse(savedPlaylists);

      const targetPlaylist = playlists.find(
        (playlist) => String(playlist.id) === String(id),
      );

      setCurrentPlaylist(targetPlaylist || null);
    } catch (error) {
      console.error("플레이리스트 불러오기 실패:", error);
      setCurrentPlaylist(null);
    }
  }, [id]);

  useEffect(() => {
    if (!currentPlaylist) return;

    const savedPlaylists = localStorage.getItem("liked_playlists");

    if (!savedPlaylists) {
      setIsLiked(false);
      return;
    }

    try {
      const likedList = JSON.parse(savedPlaylists);

      setIsLiked(
        likedList.some(
          (playlist) => String(playlist.id) === String(currentPlaylist.id),
        ),
      );
    } catch (error) {
      console.error("좋아요 플레이리스트 확인 실패:", error);
      setIsLiked(false);
    }
  }, [currentPlaylist]);

  if (!currentPlaylist) {
    return (
      <main className="flex-1 bg-[#0F172A] text-white flex flex-col">
        <PageTitle title="PLAYLIST" />

        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">
            플레이리스트를 찾을 수 없습니다.
          </p>
        </div>
      </main>
    );
  }

  const songs = currentPlaylist.songs || [];

  const genreMap = {
    "K-Pop": "K-pop",
    Pop: "팝",
    Rock: "rock",
    "R&B/Soul": "R&B",
    "Hip-Hop/Rap": "힙합",
    Electronic: "일렉트로닉",
    Dance: "댄스",
    Classical: "클래식",
    Jazz: "재즈",
    Country: "컨트리",
    Alternative: "얼터너티브",
    "Indie Rock": "인디 록",
    "Singer/Songwriter": "싱어송라이터",
    Reggae: "레게",
    Blues: "블루스",
    Metal: "메탈",
    Soundtrack: "사운드트랙",
  };

  const displayGenres = [
    ...new Set(songs.map((song) => song.genre).filter(Boolean)),
  ]
    .map((genre) => genreMap[genre] || genre)
    .slice(0, 3);

  const handlePlayTrack = (song) => {
    if (isEditing) return;

    navigate(`/music/${song.id}`, {
      state: {
        track: {
          id: song.id,
          title: song.title,
          artist: song.artist,
          image: song.image,
          previewUrl: song.previewUrl || "",
          genre: song.genre || "Pop",
        },
      },
    });
  };

  const handleToggleLikePlaylist = () => {
    const savedPlaylists = localStorage.getItem("liked_playlists");

    let likedList = savedPlaylists ? JSON.parse(savedPlaylists) : [];

    if (isLiked) {
      likedList = likedList.filter(
        (playlist) => String(playlist.id) !== String(currentPlaylist.id),
      );

      setIsLiked(false);
    } else {
      const newLikedPlaylist = {
        id: currentPlaylist.id,
        title: currentPlaylist.title,
        description: currentPlaylist.description,
        coverImage: currentPlaylist.coverImage || "",
        songs: currentPlaylist.songs || [],
      };

      likedList.push(newLikedPlaylist);

      setIsLiked(true);
    }

    localStorage.setItem("liked_playlists", JSON.stringify(likedList));
  };

  const handleDeleteSong = (songId) => {
    const updatedSongs = currentPlaylist.songs.filter(
      (song) => String(song.id) !== String(songId),
    );

    const updatedPlaylist = {
      ...currentPlaylist,
      songs: updatedSongs,
    };

    setCurrentPlaylist(updatedPlaylist);

    const savedPlaylists = localStorage.getItem("mume_playlists");

    if (savedPlaylists) {
      try {
        const playlists = JSON.parse(savedPlaylists);

        const updatedPlaylists = playlists.map((playlist) =>
          String(playlist.id) === String(currentPlaylist.id)
            ? updatedPlaylist
            : playlist,
        );

        localStorage.setItem(
          "mume_playlists",
          JSON.stringify(updatedPlaylists),
        );
      } catch (error) {
        console.error("플레이리스트 저장 실패:", error);
      }
    }

    const savedLikedPlaylists = localStorage.getItem("liked_playlists");

    if (savedLikedPlaylists) {
      try {
        const likedList = JSON.parse(savedLikedPlaylists);

        const updatedLiked = likedList.map((playlist) =>
          String(playlist.id) === String(currentPlaylist.id)
            ? updatedPlaylist
            : playlist,
        );

        localStorage.setItem("liked_playlists", JSON.stringify(updatedLiked));
      } catch (error) {
        console.error("좋아요 플레이리스트 저장 실패:", error);
      }
    }
  };

  return (
    <main className="flex-1 bg-[#0F172A] text-white overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <PageTitle title="PLAYLIST" />

      <div className="flex justify-end items-center px-5 pt-4 relative">
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-white p-1.5 rounded-full hover:bg-white/5 transition-colors"
          >
            <MoreHorizontal size={24} strokeWidth={3} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />

              <div className="absolute right-0 mt-2 w-40 bg-[#1E293B]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-white hover:bg-white/10 transition-colors flex items-center gap-2.5 font-medium"
                >
                  <Edit3 size={15} className="text-gray-400" />
                  <span>수정하기</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mx-5 mt-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />

            <span className="text-[13px] text-blue-300 font-medium">
              삭제할 노래를 선택해주세요
            </span>
          </div>

          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[12px] font-bold active:scale-95 transition-all"
          >
            <X size={14} />
            완료
          </button>
        </div>
      )}

      <section className="flex flex-col items-center text-center px-5 mt-2">
        <div className="w-[205px] h-[205px] rounded-[22px] overflow-hidden bg-white shadow-xl mt-1 mb-3">
          {currentPlaylist.coverImage ? (
            <img
              src={currentPlaylist.coverImage}
              alt={currentPlaylist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white" />
          )}
        </div>

        <h2 className="text-[25px] leading-tight font-bold mb-1">
          {currentPlaylist.title || "플리 이름"}
        </h2>

        <p className="text-[14px] text-[#d9d9d9] mb-1">
          {currentPlaylist.description || "플레이리스트 설명"}
        </p>

        <p className="text-[13px] text-[#A5A9B4] mb-4">{songs.length}곡</p>

        {displayGenres.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {displayGenres.map((genre, index) => (
              <span
                key={`${genre}-${index}`}
                className="px-3 py-1 bg-white text-[#111827] rounded-full text-[11px] font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleToggleLikePlaylist}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium active:scale-95 transition-all ${
              isLiked ? "bg-red-500 text-white" : "bg-white text-[#111827]"
            }`}
          >
            <Heart
              size={14}
              strokeWidth={1.8}
              fill={isLiked ? "currentColor" : "none"}
            />
            좋아요
          </button>

          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#111827] rounded-full text-[12px] font-medium active:scale-95 transition-transform">
            <Shuffle size={14} strokeWidth={2} />
            랜덤 미리듣기
          </button>
        </div>
      </section>

      <section className="px-4 pb-8">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-400 text-sm">
              아직 추가된 음악이 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-16">
            {songs.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className="flex items-center gap-3"
              >
                <div className="w-[80px] h-[80px] rounded-[17px] overflow-hidden bg-white shrink-0">
                  {song.image ? (
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-white truncate">
                    {song.artist}
                  </p>

                  <p className="text-[13px] text-[#A5A9B4] truncate mt-1">
                    {song.title}
                  </p>
                </div>

                {isEditing ? (
                  <button
                    onClick={() => handleDeleteSong(song.id)}
                    className="w-[38px] h-[38px] rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all"
                  >
                    <Trash2 size={17} />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlayTrack(song)}
                    className="w-[38px] h-[38px] rounded-full bg-white text-[#111827] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                  >
                    <Play size={17} fill="currentColor" className="ml-0.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
