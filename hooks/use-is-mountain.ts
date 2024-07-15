import React, { useEffect, useState } from "react";

export default function useIsMountain() {
  const [isMountain, setIsMountain] = useState(false);
  useEffect(() => {
    setIsMountain(true);
  }, []);
  return isMountain;
}
