export interface ApiErrorPayload {
  code: string;
  message: string;
  correlation_id?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public payload: ApiErrorPayload,
    public retryAfter?: number
  ) {
    super(payload.message || `API Error (${status})`);
    this.name = "ApiError";
  }
}

export class AntiIdorError extends ApiError {
  constructor(payload: ApiErrorPayload) {
    super(403, payload);
    this.name = "AntiIdorError";
  }
}

export class RateLimitError extends ApiError {
  constructor(payload: ApiErrorPayload, retryAfter?: number) {
    super(429, payload, retryAfter);
    this.name = "RateLimitError";
  }
}

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // If local development, use localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/+$/, "");
    }
    // In production browser, use same-origin Next.js rewrite proxy to bypass CORS and ad-blockers
    return "/api/proxy";
  }
  return (process.env.NEXT_PUBLIC_API_URL || "https://ahmad-portfolio-api-yl4h.onrender.com/api/v1").replace(/\/+$/, "");
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const correlationId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "client-req";

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "X-Client-Request-Id": correlationId,
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const targetUrl = `${base}${cleanEndpoint}`;

  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  // Response Interceptors
  if (!response.ok) {
    const errorPayload: ApiErrorPayload = data?.error || {
      code: `HTTP_${response.status}`,
      message: data?.message || response.statusText || "An unexpected error occurred.",
      errors: data?.errors,
    };

    // 401 Interceptor: Purge expired credentials
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    // 403 Interceptor: Anti-IDOR & Authorization protection
    if (response.status === 403) {
      throw new AntiIdorError(errorPayload);
    }

    // 429 Interceptor: Rate Limiting handling
    if (response.status === 429) {
      const retryAfterHeader = response.headers.get("Retry-After");
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;
      throw new RateLimitError(errorPayload, retryAfter);
    }

    throw new ApiError(response.status, errorPayload);
  }

  return data as T;
}
