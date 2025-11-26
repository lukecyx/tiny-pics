"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useSessionId() {
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    let id = localStorage.getItem("sessionId");

    if (!id) {
      id = uuidv4();
      localStorage.setItem("sessionId", id);
    }

    return id;
  });

  return sessionId;
}
