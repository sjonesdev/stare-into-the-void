"use client";

import { useEffect } from "react";

/**
 * Run a function on mount
 * @param func The function to run. Can optionally return a cleanup function to run on unmount, just as with useEffect.
 * @returns A function to run on unmount
 */
export default function useOnMount(func: () => void | (() => void)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(func, []);
}
