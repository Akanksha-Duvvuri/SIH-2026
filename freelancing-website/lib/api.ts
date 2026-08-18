const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ApiOptions = RequestInit & { json?: unknown };

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {})
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export { API_URL };
