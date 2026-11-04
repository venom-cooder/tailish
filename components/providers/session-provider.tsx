"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { PetParent } from "@/lib/types";

interface SessionContextValue {
  parent: PetParent | null;
  authenticated: boolean;
  /** True until the first session check resolves. */
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [parent, setParent] = React.useState<PetParent | null>(null);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const session = await api.auth.session();
      setParent(session.parent);
      setAuthenticated(session.authenticated);
    } catch {
      // An unreachable session endpoint means signed out, not broken.
      setParent(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Checked once on mount. State is only set from the promise callbacks so the
  // effect body stays free of synchronous setState.
  React.useEffect(() => {
    let active = true;

    api.auth
      .session()
      .then((session) => {
        if (!active) return;
        setParent(session.parent);
        setAuthenticated(session.authenticated);
      })
      .catch(() => {
        // An unreachable session endpoint means signed out, not broken.
        if (!active) return;
        setParent(null);
        setAuthenticated(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signOut = React.useCallback(async () => {
    await api.auth.logout();
    setParent(null);
    setAuthenticated(false);
  }, []);

  const value = React.useMemo<SessionContextValue>(
    () => ({ parent, authenticated, loading, refresh, signOut }),
    [parent, authenticated, loading, refresh, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = React.useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside <SessionProvider>");
  return context;
}
