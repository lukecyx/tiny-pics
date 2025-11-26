import { useEffect, useState, useRef } from "react";

const INTERVAL = 3000;

export interface UseGetUploadStatusArgs {
  sessionId: string;
  shouldPoll: boolean;
}

export type UploadStatus = {
  status: string;
  images: {
    key: string;
    url: string;
    filename: string;
    height: string;
    width: string;
  }[];
};

export function useGetUploadStatus({
  sessionId,
  shouldPoll,
}: UseGetUploadStatusArgs): UploadStatus {
  const [status, setStatus] = useState("");
  const [images, setImages] = useState([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId || !shouldPoll) {
      return;
    }

    const checkStatus = async () => {
      const response = await fetch(
        `http://localhost:3000/api/poll?sessionId=${sessionId}`,
      );
      const data = await response.json();

      try {
        if (data.success) {
          setStatus("done");
          setImages(data.images);
          // TODO: fix this properly
          if (typeof window !== "undefined") {
            localStorage.setItem("hasImages", "true");
          }

          if (data.status && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          return;
        } else {
          setStatus("processing");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    checkStatus();

    intervalRef.current = setInterval(checkStatus, INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId, shouldPoll]);

  return { status, images };
}
