export function extractImageDimensions(key: string) {
  const dimensions = key.split("_").at(-1);

  return dimensions ? dimensions.split("x") : ["0", "0"];
}
