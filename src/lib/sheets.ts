// Client for the Google Apps Script web app in google-apps-script/code.gs.

const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwNxLe0x4ln0-wISLGjggyiUuUd_zTJAj9EuySqZloTPn4LCZtnPRmp2SHr6-3wJHcD/exec';

const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || DEFAULT_SCRIPT_URL;

export type SheetKey = 'RSVP' | 'WISH';

export interface SheetWish {
  name: string;
  message: string;
  createdAt: string;
}

export async function submitToSheet(sheet: SheetKey, data: Record<string, string>): Promise<void> {
  if (!scriptUrl) {
    throw new Error('VITE_GOOGLE_APPS_SCRIPT_URL is not configured.');
  }

  // Form-encoded + no-cors keeps this a "simple" request, so Apps Script
  // accepts it without a CORS preflight. The response is opaque.
  await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({ sheet, ...data }),
  });
}

export async function fetchWishes(): Promise<SheetWish[]> {
  if (!scriptUrl) return [];

  const res = await fetch(`${scriptUrl}?action=wishes`);
  const json = await res.json();
  return json.ok && Array.isArray(json.wishes) ? json.wishes : [];
}
