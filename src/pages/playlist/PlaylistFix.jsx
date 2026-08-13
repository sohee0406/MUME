import React, { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { useScrollTop } from "../../lib/useScrollTop";

export default function PlaylistFix({ onSave, initialData }) {
  useScrollTop();
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : "",
  );

  const [imagePreview, setImagePreview] = useState(
    initialData ? initialData.coverImage : null,
  );
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    onSave({
      title: title || "이름 없는 플레이리스트",
      description: description,
      coverImage: imagePreview,
      songCount: initialData ? initialData.songCount : 0,
    });
  };

  return (
    <div className="flex flex-col h-full text-white font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <main className="flex-1 px-5 pt-8 overflow-y-auto pb-6 scrollbar-hide flex flex-col items-center">
        <h2 className="text-2xl font-bold w-full text-left mb-1">
          {initialData ? "플레이리스트 수정" : "새 플레이리스트 생성"}
        </h2>
        <p className="text-gray-400 text-sm w-full text-left mb-6">
          {initialData
            ? "플레이리스트 정보를 수정합니다."
            : "새로운 플레이리스트를 만들어보세요."}
        </p>

        <div
          onClick={handleImageClick}
          className="w-[180px] h-[180px] bg-[#dcdcdc] rounded-[32px] border-2 border-dashed border-gray-400 flex flex-col items-center justify-center gap-2 mt-4 cursor-pointer active:scale-95 transition-transform overflow-hidden relative group"
        >
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Playlist Cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors active:scale-90"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <>
              <Plus className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
              <span className="text-gray-600 text-sm font-medium">
                커버 선택
              </span>
            </>
          )}
        </div>

        <p className="text-gray-400 text-xs mt-4 mb-8 text-center">
          사진을 선택하면 플레이리스트 커버로 설정됩니다.
        </p>

        <div className="w-full mb-6">
          <label className="block text-base font-bold mb-2 text-left pl-1">
            플레이리스트 이름
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예 ) 공부할 때"
            className="w-full bg-[#2d3244] border-none rounded-xl py-3.5 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        <div className="w-full mb-6">
          <label className="block text-base font-bold mb-2 text-left pl-1">
            설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="플레이리스트를 소개해 주세요."
            rows={4}
            className="w-full bg-[#2d3244] border-none rounded-xl py-3.5 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
          />
        </div>

        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#dcdcdc] rounded-full py-3.5 text-[#111111] font-bold text-sm shadow-md active:scale-[0.98] transition-all"
          >
            저장하기
          </button>
        </div>
      </main>
    </div>
  );
}
