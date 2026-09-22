"use client";

import { useEffect, useState } from "react";

/** true после первого клиентского рендера — страховка от hydration mismatch. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
