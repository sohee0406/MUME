import React, { useState, useRef } from "react";
import { Plus, X, ArrowLeft } from "lucide-react"; // ArrowLeft 아이콘 추가

export default function PlaylistFix({ onBack, onSave, initialData }) {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : "",
  );

  // 이미지 파일 상태 및 파일 Input ref 생성
  const [imagePreview, setImagePreview] = useState(
    initialData ? initialData.coverImage : null,
  );
  const fileInputRef = useRef(null);

  // 이미지 영역 클릭 시 파일 선택창을 띄우는 함수
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // 이미지 업로드 완료 시 프리뷰 처리 함수
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

  // 💡 업로드된 사진을 삭제하는 함수
  const handleRemoveImage = (e) => {
    e.stopPropagation(); // 커버 선택 구역 클릭 이벤트 전파 방지
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // input value 초기화
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
      {/* 숨겨진 파일 인풋 박스 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* 💡 상단 헤더 영역 (뒤로가기 버튼 포함) */}
      <header className="flex items-center px-4 py-4 shrink-0 border-b border-white/5 bg-transparent">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-white hover:bg-white/5 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold ml-2">
          {initialData ? "플레이리스트 수정" : "새 플레이리스트 생성"}
        </h2>
      </header>

      {/* 메인 입력 영역 */}
      <main className="flex-1 px-5 pt-4 overflow-y-auto pb-6 scrollbar-hide flex flex-col items-center">
        {/* 이미지 업로드/삭제 영역 */}
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
              {/* 💡 이미지 우측 상단 X 버튼 (사진 삭제) */}
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

        {/* 플레이리스트 이름 입력 */}
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

        {/* 설명 입력 */}
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

        {/* 하단 버튼 세트 */}
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
