import React, { useState, useEffect, useRef } from "react";
import { type Note } from "../types";
import { Plus, X, Upload } from "lucide-react";

interface ImageCollectionProps {
  note: Note | undefined;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export const ImageCollection: React.FC<ImageCollectionProps> = ({
  note,
  onUpdate,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse images from content on load
  useEffect(() => {
    if (note?.content) {
      try {
        const parsed = JSON.parse(note.content);
        if (Array.isArray(parsed)) {
          console.log("ImageCollection: Loaded images", parsed);
          setImages(parsed);
        } else {
          setImages([]);
        }
      } catch (e) {
        console.error("ImageCollection: Failed to parse content", e);
        setImages([]);
      }
    } else {
      setImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id]);

  const saveImages = (newImages: string[]) => {
    console.log("ImageCollection: Saving images", newImages);
    setImages(newImages);
    if (note) {
      onUpdate(note.id, { content: JSON.stringify(newImages) });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("ImageCollection: File input change", files);
    if (files && files.length > 0) {
      const newPaths: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`ImageCollection: Processing file ${file.name}`);
        try {
          const buffer = await file.arrayBuffer();
          console.log(`ImageCollection: Buffer created for ${file.name}`);
          const imagePath = await window.electronAPI.saveImage(buffer);
          console.log(`ImageCollection: Image saved at ${imagePath}`);
          newPaths.push(imagePath);
        } catch (error) {
          console.error("ImageCollection: Failed to save image", error);
        }
      }
      if (newPaths.length > 0) {
        saveImages([...images, ...newPaths]);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    saveImages(images.filter((_, index) => index !== indexToRemove));
  };

  if (!note) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-8 pt-12">
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdate(note.id, { title: e.target.value })}
        placeholder="Collection Title"
        className="bg-transparent text-4xl font-bold text-white placeholder-slate-600 focus:outline-none mb-8 w-full"
      />

      {images.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-12 text-slate-500">
          <Upload size={48} className="mb-4 opacity-50" />
          <p className="text-xl font-medium mb-2">No images yet</p>
          <p className="mb-6">Upload images to start your collection</p>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            <span>Add Images</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max pb-20">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="group relative flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-slate-500"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={src}
                  alt={`Collection item ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Image load error:", src, e);
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement?.classList.add(
                      "flex",
                      "items-center",
                      "justify-center",
                      "text-red-500",
                    );
                    e.currentTarget.parentElement!.innerHTML =
                      "<span>Failed to load</span>";
                  }}
                />
              </div>
              <div className="p-3 bg-slate-800 flex justify-between items-center border-t border-slate-700">
                <span className="text-xs text-slate-400 truncate flex-1 pr-2">
                  Image {index + 1}
                </span>
                <button
                  onClick={() => removeImage(index)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleUploadClick}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/5 transition-all group"
          >
            <div className="p-4 rounded-full bg-slate-800 group-hover:bg-blue-500/10 mb-3 transition-colors">
              <Plus size={32} />
            </div>
            <span className="font-medium">Add More</span>
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};
