"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });
    
    // lenis.autoRaf is enabled by default in recent versions,
    // but just in case we can leave it to internal handling or do raf explicitly.
    // Lenis v1.1.x+ automatically handles raf if autoRaf is true.

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
