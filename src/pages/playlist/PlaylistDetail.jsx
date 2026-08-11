import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Heart, Shuffle, Play, ArrowLeft } from "lucide-react";

// ⭐ 부모(Playlist.jsx)가 내려준 onBack 프롭스를 구조 분해 할당으로 받습니다.
export default function PlaylistDetail({
  playlist,
  selectedTrack,
  onAddSong,
  onBack,
}) {
  const navigate = useNavigate();

  // 💡 해당 플레이리스트가 이미 좋아요(저장) 상태인지 확인하는 state
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!playlist) return;

    // 로컬스토리지에서 기존 좋아요 플레이리스트 리스트 로드
    const savedPlaylists = localStorage.getItem("liked_playlists");
    if (savedPlaylists) {
      const likedList = JSON.parse(savedPlaylists);
      const exists = likedList.some(
        (p) => String(p.id) === String(playlist.id),
      );
      setIsLiked(exists);
    }
  }, [playlist]);

  if (!playlist) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F172A] text-white">
        플레이리스트를 찾을 수 없습니다.
      </div>
    );
  }

  const songs = playlist.songs || [];

  /* =========================
      장르 이름 변환
  ========================= */
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

  const genres = [...new Set(songs.map((song) => song.genre).filter(Boolean))];

  const displayGenres = genres
    .map((genre) => genreMap[genre] || genre)
    .slice(0, 3);

  /* =========================
      💡 음악 상세 페이지(/music/:id) 이동 함수
  ========================= */
  const handlePlayTrack = (song) => {
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

  /* =========================
      💡 플레이리스트 좋아요 토글 함수
  ========================= */
  const handleToggleLikePlaylist = () => {
    const savedPlaylists = localStorage.getItem("liked_playlists");
    let likedList = savedPlaylists ? JSON.parse(savedPlaylists) : [];

    if (isLiked) {
      likedList = likedList.filter((p) => String(p.id) !== String(playlist.id));
      setIsLiked(false);
    } else {
      const targetPlaylist = {
        id: playlist.id,
        title: playlist.title,
        coverImage: playlist.coverImage || "",
        songs: songs,
      };
      likedList.push(targetPlaylist);
      setIsLiked(true);
    }

    localStorage.setItem("liked_playlists", JSON.stringify(likedList));
  };

  return (
    <main className="flex-1 bg-[#0F172A] text-white overflow-y-auto scrollbar-hide">
      {/* 💡 상단 조작 바 (onBack 실행으로 변경하여 내부의 리스트 뷰로 정상 복귀) */}
      <div className="flex justify-between items-center px-5 pt-4">
        <button
          onClick={onBack} // ⭐ 부모 컴포넌트의 setView("list")를 호출하여 플레이리스트 메인 화면을 보여줍니다.
          className="p-1.5 rounded-full bg-white/5 active:bg-white/10 transition-colors inline-flex items-center justify-center text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <button className="text-white p-1.5">
          <MoreHorizontal size={24} strokeWidth={3} />
        </button>
      </div>

      {/* 플레이리스트 정보 */}
      <section className="flex flex-col items-center text-center px-5">
        {/* 커버 */}
        <div className="w-[205px] h-[205px] rounded-[22px] overflow-hidden bg-[white] shadow-xl mt-1 mb-3">
          {playlist.coverImage ? (
            <img
              src={playlist.coverImage}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[white]" />
          )}
        </div>

        {/* 제목 */}
        <h2 className="text-[25px] leading-tight font-bold mb-1">
          {playlist.title || "플리 이름"}
        </h2>

        {/* 설명 */}
        <p className="text-[14px] text-[#d9d9d9] mb-1">
          {playlist.description || "플레이리스트 설명"}
        </p>

        {/* 곡 수 */}
        <p className="text-[13px] text-[#A5A9B4] mb-4">{songs.length}곡</p>

        {/* 장르 버튼 */}
        {displayGenres.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {displayGenres.map((genre, index) => (
              <span
                key={`${genre}-${index}`}
                className="px-3 py-1 bg-[white] text-[#111827] rounded-full text-[11px] font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* 저장 / 랜덤 미리듣기 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleToggleLikePlaylist}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium active:scale-95 transition-all ${
              isLiked ? "bg-red-500 text-white" : "bg-[white] text-[#111827]"
            }`}
          >
            <Heart
              size={14}
              strokeWidth={1.8}
              fill={isLiked ? "currentColor" : "none"}
            />
            {isLiked ? "좋아요" : "좋아요"}
          </button>

          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[white] text-[#111827] rounded-full text-[12px] font-medium active:scale-95 transition-transform">
            <Shuffle size={14} strokeWidth={2} />
            랜덤 미리듣기
          </button>
        </div>
      </section>

      {/* 음악 목록 */}
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
                {/* 앨범 이미지 */}
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

                {/* 곡 정보 */}
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-white truncate">
                    {song.artist}
                  </p>
                  <p className="text-[13px] text-[#A5A9B4] truncate mt-1">
                    {song.title}
                  </p>
                </div>

                {/* 재생 버튼 */}
                <button
                  onClick={() => handlePlayTrack(song)}
                  className="w-[38px] h-[38px] rounded-full bg-white text-[#111827] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                >
                  <Play size={17} fill="currentColor" className="ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 음악 추가 영역 */}
        {selectedTrack && (
          <div className="mt-8">
            <div className="bg-[#1E293B] rounded-[20px] p-4 mb-3">
              <p className="text-[11px] text-[#94A3B8] mb-1">추가할 음악</p>
              <p className="text-[14px] font-bold text-white truncate">
                {selectedTrack.title}
              </p>
              <p className="text-[12px] text-[#94A3B8] truncate mt-1">
                {selectedTrack.artist}
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
