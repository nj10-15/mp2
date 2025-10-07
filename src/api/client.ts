/**
 Axios client + tiny read-through cache.
 - Cache helps with rate limits and page-to-page back/forward navigation.
 - Safe to keep in-memory only (clears on refresh).
 */
import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://api.artic.edu/api/v1',
  timeout: 12000,
});

//simple (URL+params) -> payload cache
const cache = new Map<string, any>();

export async function getCached<T>(
  url: string,
  params?: Record<string, any>
): Promise<T> {
  const key = url + JSON.stringify(params ?? {});
  if (cache.has(key)) return cache.get(key);
  const res = await http.get<T>(url, { params });
  cache.set(key, res.data);
  return res.data;
}
