import React, { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { useScrollTop } from "../../lib/useScrollTop";

export default function PlaylistFix({ onSave, initialData }) {
  useScrollTop();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  const [imagePreview, setImagePreview] = useState(
    initialData?.coverImage || "",
  );

  const fileInputRef = useRef(null);

  // 이미지 선택
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 압축
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // 최대 크기
          const MAX_SIZE = 600;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = (height * MAX_SIZE) / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = (width * MAX_SIZE) / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // JPEG로 압축
          const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

          resolve(compressedImage);
        };

        img.onerror = reject;
        img.src = event.target.result;
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  // 이미지 업로드
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택해주세요.");
      return;
    }

    try {
      const compressedImage = await compressImage(file);

      console.log("압축된 이미지 크기:", compressedImage.length);

      setImagePreview(compressedImage);
    } catch (error) {
      console.error("이미지 압축 실패:", error);
      alert("이미지를 불러오지 못했습니다.");
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 저장
  const handleSubmit = () => {
    const playlistData = {
      title: title.trim() || "이름 없는 플레이리스트",
      description: description.trim(),
      coverImage: imagePreview || "",
    };

    console.log("저장할 플레이리스트:", playlistData);

    onSave(playlistData);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0B0F19] text-white font-sans">
      {/* 파일 업로드 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      <main className="flex-1 px-5 pt-8 pb-10 overflow-y-auto">
        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-1">
          {initialData ? "플레이리스트 수정" : "새 플레이리스트 생성"}
        </h2>

        <p className="text-gray-400 text-sm mb-8">
          {initialData
            ? "플레이리스트 정보를 수정합니다."
            : "새로운 플레이리스트를 만들어보세요."}
        </p>

        {/* 커버 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleImageClick}
            className="w-[180px] h-[180px] bg-[#dcdcdc] rounded-[32px] border-2 border-dashed border-gray-400 flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform overflow-hidden relative"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="플레이리스트 커버"
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center active:scale-90 transition"
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
          </button>

          <p className="text-gray-400 text-xs mt-4 mb-8 text-center">
            사진을 선택하면 플레이리스트 커버로 설정됩니다.
          </p>
        </div>

        {/* 이름 */}
        <div className="w-full mb-6">
          <label className="block text-base font-bold mb-2 pl-1">
            플레이리스트 이름
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예 ) 공부할 때"
            className="w-full bg-[#2d3244] rounded-xl py-3.5 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        {/* 설명 */}
        <div className="w-full mb-8">
          <label className="block text-base font-bold mb-2 pl-1">설명</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="플레이리스트를 소개해 주세요."
            rows={4}
            className="w-full bg-[#2d3244] rounded-xl py-3.5 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
          />
        </div>

        {/* 저장 */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-white rounded-full py-4 text-[#111111] font-bold text-sm shadow-md active:scale-[0.98] transition-all"
        >
          저장하기
        </button>
      </main>
    </div>
  );
}
