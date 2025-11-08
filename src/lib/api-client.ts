/* eslint @typescript-eslint/no-explicit-any: off */
export interface ApiErrorShape {
  status: number;
  message: string;
  details?: any;
}

export class ApiError extends Error implements ApiErrorShape {
  status: number;
  details?: any;
  constructor(err: ApiErrorShape) {
    super(err.message);
    this.status = err.status;
    this.details = err.details;
  }
}

interface RequestOptions extends RequestInit {
  json?: any;
  parse?: boolean; // disable json parse
}

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { json, headers, parse = true, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(headers as any),
  };

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: json ? JSON.stringify(json) : rest.body,
  });

  const maybeBody = parse ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError({ status: res.status, message: maybeBody?.message || res.statusText, details: maybeBody });
  }
  return (maybeBody as T);
}

export const apiClient = {
  get: <T>(url: string, opts?: RequestOptions) => request<T>(url, { ...opts, method: 'GET' }),
  post: <T>(url: string, json?: any, opts?: RequestOptions) => request<T>(url, { ...opts, method: 'POST', json }),
  put: <T>(url: string, json?: any, opts?: RequestOptions) => request<T>(url, { ...opts, method: 'PUT', json }),
  patch: <T>(url: string, json?: any, opts?: RequestOptions) => request<T>(url, { ...opts, method: 'PATCH', json }),
  delete: <T>(url: string, opts?: RequestOptions) => request<T>(url, { ...opts, method: 'DELETE' }),
};
