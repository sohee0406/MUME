import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MoreVertical, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import PlaylistFix from "./PlaylistFix";
import PlaylistDetail from "./PlaylistDetail";

export default function Playlist() {
  const location = useLocation();
  const navigate = useNavigate();

  const [view, setView] = useState("list");
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const addTrack =
    location.state?.selectedTrack || location.state?.addTrack || null;
  const isSelectionMode = addTrack !== null;

  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem("mume_playlists");
    return savedPlaylists ? JSON.parse(savedPlaylists) : [];
  });

  const [openMenuId, setOpenMenuId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: "", desc: "" });

  const menuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("mume_playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    if (location.state?.selectedPlaylist) {
      const targetPlaylist = location.state.selectedPlaylist;
      setEditingPlaylist(targetPlaylist);
      setView("detail");

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const toggleMenu = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleOpenCreate = () => {
    setEditingPlaylist(null);
    setView("fix");
  };

  const handleOpenEdit = (playlist, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPlaylist(playlist);
    setView("fix");
    setOpenMenuId(null);
  };

  const handlePlaylistClick = (playlist) => {
    if (isSelectionMode) {
      executeAddSong(playlist, addTrack);
    } else {
      setEditingPlaylist(playlist);
      setView("detail");
    }
  };

  const executeAddSong = (targetPlaylist, track) => {
    if (!targetPlaylist || !track) return;

    const alreadyExists = (targetPlaylist.songs || []).some(
      (song) => String(song.id) === String(track.id),
    );

    if (alreadyExists) {
      setAlertMessage({
        title: "곡 추가 실패",
        desc: "이미 이 플레이리스트에\n추가된 음악입니다.",
      });
      setIsAlertModalOpen(true);
      return;
    }

    const newSong = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      image: track.image || track.cover || "",
      previewUrl: track.previewUrl || "",
      genre: track.genre || "Pop",
    };

    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        String(playlist.id) === String(targetPlaylist.id)
          ? { ...playlist, songs: [...(playlist.songs || []), newSong] }
          : playlist,
      ),
    );

    setEditingPlaylist((prev) =>
      prev && String(prev.id) === String(targetPlaylist.id)
        ? { ...prev, songs: [...(prev.songs || []), newSong] }
        : prev,
    );

    setAlertMessage({
      title: "곡 추가 완료",
      desc: `"${track.title}"이(가)\n"${targetPlaylist.title}"에 저장되었습니다.`,
    });
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);

    if (alertMessage.title === "곡 추가 완료") {
      navigate(location.pathname, { replace: true, state: {} });
      setView("list");
    }
  };

  const handleSavePlaylist = (data) => {
    if (editingPlaylist) {
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          String(playlist.id) === String(editingPlaylist.id)
            ? {
                ...playlist,
                title: data.title,
                description: data.description,
                coverImage: data.coverImage,
                // 기존 songs 데이터가 유실되지 않도록 유지합니다.
              }
            : playlist,
        ),
      );
    } else {
      const newPlaylist = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        songCount: 0,
        songs: [],
      };
      setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
    }
    setView("list");
  };

  const openDeleteModal = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setTargetDeleteId(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (targetDeleteId === null) return;

    setPlaylists((prevPlaylists) =>
      prevPlaylists.filter(
        (playlist) => String(playlist.id) !== String(targetDeleteId),
      ),
    );

    const savedLikedPlaylists = localStorage.getItem("liked_playlists");
    if (savedLikedPlaylists) {
      const likedList = JSON.parse(savedLikedPlaylists);
      const updatedLiked = likedList.filter(
        (playlist) => String(playlist.id) !== String(targetDeleteId),
      );
      localStorage.setItem("liked_playlists", JSON.stringify(updatedLiked));
    }

    setEditingPlaylist(null);
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTargetDeleteId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-app-bg text-white max-w-md mx-auto shadow-2xl relative font-sans overflow-hidden">
      {view === "list" && (
        <main className="flex-1 flex flex-col px-5 pt-8 overflow-hidden">
          <div className="shrink-0">
            <h2 className="text-2xl font-bold mb-1 text-ellipsis overflow-hidden">
              {isSelectionMode ? "플리 선택하기" : "MY PLAYLIST"}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isSelectionMode
                ? `"${addTrack.title}"을(를) 어디에 담을까요?`
                : "내가 저장한 음악"}
            </p>
          </div>

          {/* 스크롤바 숨김 속성 추가 */}
          <div className="flex-1 overflow-y-auto mb-6 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {playlists.length === 0 ? (
              <div className="flex flex-col gap-10">
                <div className="bg-white rounded-[32px] h-[280px] flex items-center justify-center shadow-inner">
                  <p className="text-[#333333] text-sm font-medium">
                    생성된 플레이 리스트가 없습니다
                  </p>
                </div>
                <button
                  onClick={handleOpenCreate}
                  className="w-full bg-white rounded-full py-4 text-[#111111] font-bold text-base shadow-md active:scale-[0.98] transition-all"
                >
                  내 playlist 추가하기 +
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between relative bg-transparent rounded-[24px]"
                  >
                    <div
                      onClick={() => handlePlaylistClick(playlist)}
                      className="flex items-center gap-4 flex-1 cursor-pointer active:opacity-70 transition-opacity select-none"
                    >
                      <div className="w-[84px] h-[84px] bg-white rounded-[20px] shrink-0 overflow-hidden shadow-md">
                        {playlist.coverImage ? (
                          <img
                            src={playlist.coverImage}
                            alt={playlist.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white mb-1">
                          {playlist.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {(playlist.songs || []).length}곡
                        </p>
                      </div>
                    </div>

                    {!isSelectionMode && (
                      <div
                        ref={playlist.id === openMenuId ? menuRef : null}
                        className="relative z-20"
                      >
                        <button
                          onClick={(e) => toggleMenu(playlist.id, e)}
                          className={`p-2 text-white active:opacity-50 transition-colors rounded-full ${
                            openMenuId === playlist.id ? "bg-white/10" : ""
                          }`}
                        >
                          <MoreVertical className="w-6 h-6" />
                        </button>

                        {openMenuId === playlist.id && (
                          <div className="absolute right-0 top-12 z-30 bg-[#252a3a] border border-white/10 rounded-xl shadow-xl w-32 overflow-hidden">
                            <button
                              onClick={(e) => handleOpenEdit(playlist, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 active:bg-white/10 transition"
                            >
                              <Edit2 className="w-4 h-4 text-gray-400" /> 수정
                            </button>
                            <div className="h-px bg-white/5" />
                            <button
                              onClick={(e) => openDeleteModal(playlist.id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition"
                            >
                              <Trash2 className="w-4 h-4" /> 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={handleOpenCreate}
                  className="w-full bg-[#dcdcdc] rounded-full py-4 text-[#111111] font-bold text-base shadow-md active:scale-[0.98] transition-transform mt-4"
                >
                  내 playlist 추가하기 +
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {view === "fix" && (
        <PlaylistFix
          initialData={editingPlaylist}
          onBack={() => setView("list")}
          onSave={handleSavePlaylist}
        />
      )}

      {view === "detail" && (
        <PlaylistDetail
          playlist={playlists.find((p) => p.id === editingPlaylist?.id)}
          onBack={() => setView("list")}
          onUpdatePlaylist={(updatedPlaylist) => {
            setEditingPlaylist(updatedPlaylist);

            setPlaylists((prev) =>
              prev.map((p) =>
                p.id === updatedPlaylist.id ? updatedPlaylist : p,
              ),
            );
          }}
        />
      )}

      {isAlertModalOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px] z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-[280px] rounded-[24px] p-6 shadow-2xl text-center flex flex-col items-center">
            <CheckCircle2
              className={`w-12 h-12 mb-3 ${alertMessage.title.includes("실패") ? "text-amber-500" : "text-emerald-500"}`}
            />
            <h3 className="text-[17px] font-bold text-[#111111] mb-2">
              {alertMessage.title}
            </h3>
            <p className="text-[#666666] text-xs font-medium mb-6 leading-relaxed whitespace-pre-line">
              {alertMessage.desc}
            </p>
            <button
              onClick={closeAlertModal}
              className="w-full bg-[#111111] text-white rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.98]"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px] z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-[280px] rounded-[24px] p-6 shadow-2xl text-center">
            <h3 className="text-[17px] font-bold text-[#111111] mb-2">
              플레이리스트 삭제
            </h3>
            <p className="text-[#666666] text-xs font-medium mb-6 leading-relaxed">
              정말 이 플레이리스트를
              <br />
              삭제하시겠습니까?
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-[#f4f4f4] text-[#555555] rounded-xl py-3 text-sm font-bold transition-all"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-[#fff0f0] text-[#ff4d4d] rounded-xl py-3 text-sm font-bold transition-all"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
