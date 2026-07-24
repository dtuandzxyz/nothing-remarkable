"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Video as VideoIcon, Sparkles } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  title?: string;
}

export default function ArtGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);

  // Xử lý khi upload thành công trên Cloudinary
  const handleUploadSuccess = (result: any) => {
    const info = result?.info;
    if (!info) return;

    const newItem: MediaItem = {
      id: info.public_id,
      url: info.secure_url,
      type: info.resource_type === "video" ? "video" : "image",
      title: info.original_filename || "Untitled Art",
    };

    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-neutral-800 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="text-amber-400 w-8 h-8" />
            MY ART SANCTUARY
          </h1>
          <p className="text-neutral-400 mt-2 text-sm md:text-base">
            Không gian lưu trữ và trưng bày tác phẩm nghệ thuật cá nhân.
          </p>
        </div>

        {/* Nút Upload kết nối Cloudinary */}
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={handleUploadSuccess}
          options={{
            sources: ["local", "url", "camera"],
            resourceType: "auto", // Tự nhận diện cả Image và Video
            multiple: true,
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-orange-500/20 active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Upload Art Mới
            </button>
          )}
        </CldUploadWidget>
      </header>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto">
        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/40">
            <ImageIcon className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">Chưa có tác phẩm nào được tải lên.</p>
            <p className="text-neutral-600 text-sm mt-1">Bấm nút Upload ở trên để đưa ảnh hoặc video của tao lên đây!</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all shadow-md"
                >
                  <div className="aspect-square relative w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                    {item.type === "video" ? (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title || "Art Piece"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Tag phân loại (Media Type Indicator) */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                      {item.type === "video" ? (
                        <>
                          <VideoIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>Video</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Image</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title overlay */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-neutral-200 truncate">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </main>
  );
}
