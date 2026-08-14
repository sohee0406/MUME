import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import PageTitle from "../../components/PageTitle";

export default function Favorite() {
  <PageTitle title={"FAVORITE"} />;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("songs");
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setLikedSongs(JSON.parse(savedFavorites));
    }

    const savedPlaylists = localStorage.getItem("liked_playlists");
    const allPlaylists =
      JSON.parse(localStorage.getItem("mume_playlists")) || [];

    if (savedPlaylists) {
      const parsedLiked = JSON.parse(savedPlaylists);

      const syncedPlaylists = parsedLiked.map((likedPl) => {
        const latestPl = allPlaylists.find(
          (p) => String(p.id) === String(likedPl.id),
        );
        return latestPl ? latestPl : likedPl;
      });

      setLikedPlaylists(syncedPlaylists);
    }
  }, []);

  const handleRemoveLike = (id, e) => {
    e.stopPropagation();
    const updatedSongs = likedSongs.filter(
      (song) => String(song.id) !== String(id),
    );
    setLikedSongs(updatedSongs);
    localStorage.setItem("favorites", JSON.stringify(updatedSongs));
  };

  const handleRemoveLikePlaylist = (id, e) => {
    e.stopPropagation();
    const updatedPlaylists = likedPlaylists.filter(
      (p) => String(p.id) !== String(id),
    );
    setLikedPlaylists(updatedPlaylists);
    localStorage.setItem("liked_playlists", JSON.stringify(updatedPlaylists));
  };

  const handleSongClick = (song) => {
    navigate(`/music/${song.id}`, { state: { track: song } });
  };

  const handlePlaylistClick = (playlist) => {
    navigate("/playlist", { state: { selectedPlaylist: playlist } });
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white max-w-md mx-auto shadow-2xl relative font-sans overflow-hidden">
      <div className="shrink-0 px-6 pt-4 pb-2">
        <h2 className="text-[28px] font-bold tracking-tight mb-1">
          Liked Music
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          내가 좋아요 표시한 음악, 플레이리스트
        </p>
      </div>

      <div className="shrink-0 px-6 my-4 flex gap-3">
        <button
          onClick={() => setActiveTab("songs")}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
            activeTab === "songs"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          노래
        </button>
        <button
          onClick={() => setActiveTab("playlists")}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
            activeTab === "playlists"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          플레이리스트
        </button>
      </div>

      <main className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {activeTab === "songs" && (
          <div className="space-y-3.5">
            {likedSongs.length === 0 ? (
              <div className="py-20 text-center text-sm text-slate-500 font-medium">
                좋아요 표시한 노래가 없습니다.
              </div>
            ) : (
              likedSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                  className="flex items-center justify-between bg-white opacity-90 rounded-[24px] p-4 cursor-pointer active:scale-[0.99] transition-transform select-none shadow-md"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-[72px] h-[72px] bg-slate-400 rounded-[20px] overflow-hidden shrink-0 shadow-sm">
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
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-bold text-[#111111] truncate mb-0.5">
                        {song.title}
                      </h3>
                      <p className="text-[13px] text-slate-600 font-medium truncate">
                        {song.artist} • {song.genre || "K-Pop"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveLike(song.id, e)}
                    className="p-2 text-red-500 active:scale-90 transition-transform shrink-0"
                  >
                    <Heart size={22} fill="currentColor" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="space-y-3.5">
            {likedPlaylists.length === 0 ? (
              <div className="py-20 text-center text-sm text-slate-500 font-medium">
                좋아요 표시한 플레이리스트가 없습니다.
              </div>
            ) : (
              likedPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist)}
                  className="flex items-center justify-between bg-white rounded-[24px] p-4 cursor-pointer active:scale-[0.99] transition-transform shadow-md"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-[72px] h-[72px] bg-slate-200 rounded-[20px] overflow-hidden shrink-0">
                      {playlist.coverImage ? (
                        <img
                          src={playlist.coverImage}
                          alt={playlist.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-bold text-[#111111] truncate mb-0.5">
                        {playlist.title}
                      </h3>
                      <p className="text-[13px] text-slate-600 font-medium truncate">
                        {playlist.songs?.length || 0}곡 • 플레이리스트
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveLikePlaylist(playlist.id, e)}
                    className="p-2 text-red-500 active:scale-90 transition-transform shrink-0"
                  >
                    <Heart size={22} fill="currentColor" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
