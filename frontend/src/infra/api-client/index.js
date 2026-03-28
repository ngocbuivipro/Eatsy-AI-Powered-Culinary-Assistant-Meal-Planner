// src/infra/api-client/index.js

/**
 * Base API client for Eatsy backend.
 * TODO: Configure with axios or fetch wrapper.
 */
const API_BASE_URL = "https://api.eatsy.app";

export async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

export async function apiPost(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}
