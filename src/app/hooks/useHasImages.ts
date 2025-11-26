export function useHasImages() {
  if (typeof window === "undefined") {
    return false;
  }

  const hasImages = localStorage.getItem("hasImages");

  return hasImages ? true : false;
}
