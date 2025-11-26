"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import Loading from "../icons/Loading";
import { Cross } from "../icons";

export type ImageDetail = {
  key: string;
  url: string;
  filename: string;
  height: string;
  width: string;
};

export interface LightboxProps {
  selectedImage: ImageDetail;
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageDetail | null>>;
}

export default function Lightbox({
  selectedImage,
  setSelectedImage,
}: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setSelectedImage]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={() => setSelectedImage(null)}
    >
      <div
        className="relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {!isLoading && (
          <button
            className="absolute top-1 right-3 z-50 text-2xl text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <Cross className="h-8 w-8" />
          </button>
        )}

        {isLoading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <Loading className="h-12 w-12 animate-spin" fill="white" />
          </div>
        )}

        <div className="relative max-h-[80vh] max-w-[90vw]">
          <Image
            onLoadingComplete={() => setIsLoading(false)}
            src={selectedImage.url}
            alt={selectedImage.filename}
            width={Number(selectedImage.width)}
            height={Number(selectedImage.height)}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
