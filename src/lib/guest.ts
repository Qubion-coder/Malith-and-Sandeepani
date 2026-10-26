import { wedding } from '../config/wedding';

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

const MAX_NAME_LENGTH = 80;

// "Dear" is a greeting style, not part of the name: the message already starts
// with "Dear", so it resolves to the bare name.
export function buildDisplayName(prefix: Prefix, rawName: string): string {
  const name = rawName.trim().replace(/\s+/g, ' ').replace(/^dear\s+/i, '');
  if (!name) return '';

  switch (prefix) {
    case 'Family':
      return `${name} and Family`;
    case 'Dear':
      return name;
    default:
      return `${prefix} ${name}`;
  }
}

export function buildInviteLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${wedding.groom.name} & ${wedding.bride.name}`;
}

const RESERVED_PATHS = new Set(['admin', 'index.html']);

/** Reads the guest display name from a `/{guestName}` URL, or null on the plain invitation. */
export function getGuestFromPath(pathname: string): string | null {
  const segment = pathname.replace(/^\/+|\/+$/g, '');
  if (!segment || segment.includes('/') || RESERVED_PATHS.has(segment.toLowerCase())) return null;

  try {
    const name = decodeURIComponent(segment).trim().replace(/\s+/g, ' ');
    return name ? name.slice(0, MAX_NAME_LENGTH) : null;
  } catch {
    return null;
  }
}

export function isAdminPath(pathname: string): boolean {
  return pathname.replace(/\/+$/, '').toLowerCase() === '/admin';
}
