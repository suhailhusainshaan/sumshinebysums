const IMG_BASE_URL = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');

export function resolveImageSrc(
  url: string | null | undefined,
  fallback = '/assets/images/no_image.png'
): string {
  if (!url) return fallback;

  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const decoded = tryDecodeBase64(url);
  if (decoded) {
    if (decoded.startsWith('data:') || decoded.startsWith('http://') || decoded.startsWith('https://')) {
      return decoded;
    }
    return `${IMG_BASE_URL}/${decoded}`;
  }

  if (!IMG_BASE_URL) return url;
  return `${IMG_BASE_URL}/${url}`;
}

function tryDecodeBase64(value: string): string | null {
  try {
    if (typeof globalThis.atob === 'function') {
      return globalThis.atob(value);
    }
  } catch {
    return null;
  }
  return null;
}
