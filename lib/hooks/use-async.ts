"use client";

import * as React from "react";
import { toErrorMessage } from "@/lib/api";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Re-runs the loader, keeping any previously loaded data on screen. */
  refresh: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/** Stable identity for the current request, so stale results can be discarded. */
function requestKey(deps: React.DependencyList, nonce: number) {
  return `${nonce}|${deps.map((dep) => String(dep)).join("|")}`;
}

/**
 * Runs an async loader and tracks loading / error / data.
 *
 * Used by every client-rendered surface so the three states are handled the
 * same way everywhere.
 *
 * `loading` is derived rather than stored: a request is in flight whenever the
 * settled result's key differs from the current one. That keeps the effect
 * free of synchronous setState calls (which cause cascading renders) and makes
 * stale responses impossible to apply.
 */
export function useAsync<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = [],
): AsyncState<T> {
  const [nonce, setNonce] = React.useState(0);
  const key = requestKey(deps, nonce);

  const [settled, setSettled] = React.useState<{
    key: string | null;
    data: T | null;
    error: string | null;
  }>({ key: null, data: null, error: null });

  // Keep the latest loader reachable from the effect without making it a
  // dependency — callers pass a new closure on every render. Written in an
  // effect, never during render.
  const loaderRef = React.useRef(loader);
  React.useEffect(() => {
    loaderRef.current = loader;
  });

  React.useEffect(() => {
    let active = true;

    loaderRef
      .current()
      .then((result) => {
        if (active) setSettled({ key, data: result, error: null });
      })
      .catch((cause) => {
        if (active) setSettled({ key, data: null, error: toErrorMessage(cause) });
      });

    return () => {
      active = false;
    };
  }, [key]);

  const refresh = React.useCallback(() => setNonce((value) => value + 1), []);

  const setData = React.useCallback<React.Dispatch<React.SetStateAction<T | null>>>(
    (update) =>
      setSettled((current) => ({
        ...current,
        data: typeof update === "function" ? (update as (prev: T | null) => T | null)(current.data) : update,
      })),
    [],
  );

  return {
    // Keep the previous data visible while a refresh is in flight.
    data: settled.data,
    loading: settled.key !== key,
    error: settled.key === key ? settled.error : null,
    refresh,
    setData,
  };
}

/**
 * Tracks an in-flight mutation (submit, add to cart, cancel a booking).
 *
 * Returns a `run` that reports pending state and surfaces a presentable error,
 * so forms and action buttons don't each reimplement it.
 */
export function useMutation<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const mounted = React.useRef(true);
  const actionRef = React.useRef(action);

  React.useEffect(() => {
    actionRef.current = action;
  });

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = React.useCallback(async (...args: TArgs): Promise<TResult | null> => {
    setPending(true);
    setError(null);
    try {
      return await actionRef.current(...args);
    } catch (cause) {
      if (mounted.current) setError(toErrorMessage(cause));
      return null;
    } finally {
      if (mounted.current) setPending(false);
    }
  }, []);

  return { run, pending, error, clearError: React.useCallback(() => setError(null), []) };
}
