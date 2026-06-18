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

  const imagePath = decoded ?? url;

  if (
    imagePath.startsWith('data:') ||
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://')
  ) {
    return imagePath;
  }

  if (!IMG_BASE_URL) return imagePath;

  const base = IMG_BASE_URL.replace(/\/+$/, '');
  const path = imagePath.replace(/^\/+/, '');

  return `${base}/${path}`;
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
