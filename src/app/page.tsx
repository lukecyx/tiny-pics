"use client";

import { useState } from "react";

import ImageList from "./components/display/ImageList";
import { UploadImageInput } from "./components/inputs";
import { useGetUploadStatus, useHasImages, useSessionId } from "./hooks";
import Loading from "./components/icons/Loading";

export default function Home() {
  const [shouldPoll, setShouldPoll] = useState(false);
  const sessionId = useSessionId();

  // HACK: fix proeprly --
  // we already set hasImages in useGetUploadStatus, which we need to remove
  // the lambda already updates done in the dynamo record to true when it's finished resizing
  // ideally, we want the following:
  // 1. resizing lambda pushes to sns when resizing is complete
  // 2. another lambda who is subscribing to that topic
  //    this will then send a message via api gateway websockets to the nextjs client
  //    the message should include the presignedUrls that can be used in next's Image component
  // 3. have a hook that establishes connection to websocket and sets state when a new message
  //    is received. When state updates, we rerender and can then display the images using
  //    the presignedUrls in <Image src={preSignedUrl} />
  const hasImages = useHasImages();

  const { status, images } = useGetUploadStatus({
    sessionId,
    shouldPoll: shouldPoll || hasImages,
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-linear-to-r from-blue-100 to-purple-100 px-8 py-12">
      <UploadImageInput onUploadStart={() => setShouldPoll(true)} />

      {status === "processing" && (
        <Loading className="mt-24 h-24 w-24 animate-spin" />
      )}
      {status === "done" && <ImageList imageDetails={images} />}
    </div>
  );
}
