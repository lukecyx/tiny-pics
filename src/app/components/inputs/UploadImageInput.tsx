"use client";

import { ChangeEvent, useState, useRef } from "react";

import { uploadFile } from "@/app/actions/uploadFile";

import { Cross, UploadImage } from "../icons";

import clsx from "clsx";
import { useSessionId } from "@/app/hooks";

export interface UploadImageInputProps {
  onUploadStart: () => void;
}

export default function UploadImageInput({
  onUploadStart,
}: UploadImageInputProps) {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sessionId = useSessionId();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleOnClickChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleOnClickClearFile = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUploadStart();

    await uploadFile(new FormData(event.currentTarget));
  };

  return (
    <div className="flex w-96 flex-col items-center gap-x-4 gap-y-8 rounded-2xl bg-white p-8 text-center shadow-xl">
      <div className="flex flex-col items-center gap-y-2">
        <UploadImage height={50} width={50} fill="" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Upload your file
        </h2>
        <p className="text-gray-500">Supports JPEG files only</p>
      </div>

      <form className="flex w-full flex-col gap-y-4" onSubmit={handleSubmit}>
        <div className="flex w-full items-center gap-x-2">
          <button
            type="button"
            onClick={handleOnClickChooseFile}
            className={clsx(
              "cursor-pointer rounded-xl border-2 border-dashed border-gray-300 px-4 py-2 text-gray-600 transition-all duration-200 ease-in-out hover:border-blue-500 hover:text-blue-500 focus:outline-blue-700",
              fileName ? "w-36" : "w-80",
            )}
          >
            Choose a file
          </button>

          {fileName && (
            <div className="flex flex-1 items-center gap-x-1 truncate rounded-md bg-gray-100 px-2 py-2">
              <span className="flex-1 truncate text-sm text-gray-600">
                {fileName}
              </span>
              <div className="focus-within:text-red-500">
                <button
                  type="button"
                  aria-label="clear file"
                  onClick={handleOnClickClearFile}
                  className="focus:rounded-xl focus:outline-red-700"
                >
                  <Cross
                    height={20}
                    width={20}
                    className="hover:rounded-xl hover:text-red-500"
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        <input type="hidden" name="sessionId" value={sessionId} />

        <input
          id="fileUpload"
          name="file"
          type="file"
          className="sr-only"
          accept=".jpeg, .jpg"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-1 hover:bg-blue-600 focus:outline-blue-700 active:scale-95 active:shadow-sm"
        >
          Upload
        </button>
      </form>

      <p className="text-sm text-gray-400">Maximum file size: 5MB</p>
    </div>
  );
}
