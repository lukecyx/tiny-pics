import Image from "next/image";
import Lightbox from "./Lightbox";

import { useState } from "react";

import Loading from "../icons/Loading";

export interface ImageListProps {
  imageDetails: {
    key: string;
    url: string;
    filename: string;
    height: string;
    width: string;
  }[];
}

export default function ImageList({ imageDetails }: ImageListProps) {
  const [selectedImage, setSelectedImage] = useState<
    null | (typeof imageDetails)[0]
  >(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleOnClickImage = (detail: (typeof imageDetails)[0]) => {
    setSelectedImage(detail);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {imageDetails.map((detail, idx) => {
          const filename = detail.filename.split("_")[0];

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleOnClickImage(detail)}
              className="flex w-full max-w-xs flex-col items-center rounded-xl bg-white px-4 py-6 shadow-md transition-shadow hover:cursor-pointer hover:shadow-lg"
            >
              <h2 className="mb-3 text-center text-lg font-semibold text-gray-800 capitalize">
                {filename}
              </h2>

              <div className="relative flex w-full items-center justify-center">
                {isLoading && <Loading className="h-12 w-12 animate-spin" />}

                <Image
                  onLoadingComplete={() => setIsLoading(false)}
                  src={detail.url}
                  alt={filename}
                  width={Number(detail.width)}
                  height={Number(detail.height)}
                  className="max-h-40 w-auto rounded-md object-contain"
                />
              </div>
            </button>
          );
        })}
      </div>

      {selectedImage && (
        <Lightbox
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  );
}
