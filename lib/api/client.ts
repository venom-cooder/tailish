import { API_BASE_URL, MOCK_LATENCY_MS, USE_REAL_API } from "@/lib/config";
import type { ApiErrorShape } from "@/lib/types";

/**
 * The one place that decides where data comes from.
 *
 * Every endpoint in /lib/api is declared with both a REST descriptor and a mock
 * implementation. `call()` picks between them based on whether
 * NEXT_PUBLIC_API_BASE_URL is set, so going live is a deployment change rather
 * than a code change — and the mock path keeps working for local development,
 * previews and tests.
 */

export class ApiError extends Error implements ApiErrorShape {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.name = "ApiError";
    this.status = shape.status;
    this.code = shape.code;
    this.details = shape.details;
  }

  /** True for failures a retry might fix (network, timeout, 5xx). */
  get isRetryable() {
    return this.status === 0 || this.status >= 500;
  }
}

export function notFound(message = "We couldn't find what you were looking for."): never {
  throw new ApiError({ status: 404, code: "not_found", message });
}

export function badRequest(message: string, details?: Record<string, unknown>): never {
  throw new ApiError({ status: 400, code: "bad_request", message, details });
}

export function unauthorized(message = "Please sign in to continue."): never {
  throw new ApiError({ status: 401, code: "unauthorized", message });
}

/** Simulated network latency, so loading states are exercised in development. */
function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type QueryValue = string | number | boolean | undefined | null;

export interface CallSpec<T> {
  method: Method;
  /** Path relative to API_BASE_URL, e.g. "/pets/pet_01/vaccinations". */
  path: string;
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Runs when no backend is configured. Receives nothing; closes over args. */
  mock: () => T | Promise<T>;
  /** Overrides the default simulated latency (ms). */
  mockLatencyMs?: number;
  /** Sent as multipart/form-data instead of JSON. */
  formData?: FormData;
}

/** Bearer token for the real API. Set by auth.verifyOtp, cleared by logout. */
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) window.localStorage.setItem("tailish:token", token);
    else window.localStorage.removeItem("tailish:token");
  }
}

export function getAuthToken() {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = window.localStorage.getItem("tailish:token");
  }
  return authToken;
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function parseError(response: Response): Promise<never> {
  let code = "request_failed";
  let message = `Request failed with status ${response.status}.`;
  let details: Record<string, unknown> | undefined;

  try {
    const payload = (await response.json()) as Partial<ApiErrorShape>;
    if (payload.code) code = payload.code;
    if (payload.message) message = payload.message;
    if (payload.details) details = payload.details;
  } catch {
    // Non-JSON error bodies fall back to the status-derived message above.
  }

  throw new ApiError({ status: response.status, code, message, details });
}

export async function call<T>(spec: CallSpec<T>): Promise<T> {
  if (!USE_REAL_API) {
    // Simulated latency is a development affordance for exercising loading
    // states in the browser. Server renders skip it so prerender stays fast.
    if (typeof window !== "undefined") {
      await delay(spec.mockLatencyMs ?? MOCK_LATENCY_MS);
    }
    return spec.mock();
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (spec.formData) {
    payload = spec.formData;
  } else if (spec.body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(spec.body);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(spec.path, spec.query), {
      method: spec.method,
      headers,
      body: payload,
      credentials: "include",
    });
  } catch (cause) {
    throw new ApiError({
      status: 0,
      code: "network_error",
      message: "We couldn't reach Tailish. Check your connection and try again.",
      details: { cause: String(cause) },
    });
  }

  if (!response.ok) await parseError(response);
  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

/** Narrows an unknown caught value to a user-presentable message. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
