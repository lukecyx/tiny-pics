import sharp from "sharp";

const IMAGE_SIZES = [
  { width: 150, height: 150, outFilename: "thumbnail_150x150" },
  { width: 320, height: 240, outFilename: "small_320x240" },
  { width: 640, height: 480, outFilename: "medium_640x480" },
  { width: 1024, height: 768, outFilename: "large_1024x768" },
  { width: 1600, height: 1200, outFilename: "extra_large_1600x1200" },
];

export interface ResizeImagesArgs {
  fileToResizeBuffer: Buffer | ArrayBuffer;
}
export async function resizeImages({ fileToResizeBuffer }: ResizeImagesArgs) {
  try {
    const resizedImagesPromises = IMAGE_SIZES.map(
      ({ width, height, outFilename }) =>
        sharp(fileToResizeBuffer)
          .resize({ width, height })
          .toBuffer()
          .then((buffer) => ({ outFilename, buffer })),
    );

    return Promise.all(resizedImagesPromises);
  } catch (error) {
    console.error("error resizing images", error);
  }
}
