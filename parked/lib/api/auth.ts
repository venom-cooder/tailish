import { getState, persist } from "@/lib/mock/store";
import type { OtpRequestResult, Session } from "@/lib/types";
import { badRequest, call, setAuthToken } from "./client";

/** The code the mock adapter always accepts. Surfaced in the UI as a hint. */
export const DEMO_OTP = "6318";

function normalisePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

export const authApi = {
  /** POST /auth/request-otp */
  requestOtp: (phone: string) =>
    call<OtpRequestResult>({
      method: "POST",
      path: "/auth/request-otp",
      body: { phone },
      mock: () => {
        const digits = normalisePhone(phone);
        if (digits.length !== 10) {
          badRequest("Enter a valid 10-digit mobile number.", { field: "phone" });
        }
        return {
          requestId: `otp_${digits}`,
          phone: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
          expiresInSec: 120,
          devCode: DEMO_OTP,
        };
      },
    }),

  /** POST /auth/verify-otp */
  verifyOtp: (phone: string, code: string) =>
    call<Session>({
      method: "POST",
      path: "/auth/verify-otp",
      body: { phone, code },
      mock: () => {
        if (code.replace(/\D/g, "") !== DEMO_OTP) {
          badRequest("That code doesn't match. Please check and try again.", { field: "code" });
        }
        const state = getState();
        const digits = normalisePhone(phone);
        state.authenticated = true;
        state.token = `demo_token_${digits}`;
        state.parent = {
          ...state.parent,
          phone: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
        };
        persist();
        setAuthToken(state.token);
        return { authenticated: true, parent: state.parent, token: state.token };
      },
    }),

  /** GET /auth/session */
  session: () =>
    call<Session>({
      method: "GET",
      path: "/auth/session",
      mockLatencyMs: 120,
      mock: () => {
        const state = getState();
        return {
          authenticated: state.authenticated,
          parent: state.authenticated ? state.parent : null,
          token: state.token,
        };
      },
    }),

  /** POST /auth/logout */
  logout: () =>
    call<{ ok: true }>({
      method: "POST",
      path: "/auth/logout",
      mock: () => {
        const state = getState();
        state.authenticated = false;
        state.token = null;
        persist();
        setAuthToken(null);
        return { ok: true as const };
      },
    }),
};
