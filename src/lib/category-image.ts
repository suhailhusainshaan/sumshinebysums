const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

function decodeBase64(value: string) {
  try {
    if (typeof globalThis.atob === 'function') {
      return globalThis.atob(value);
    }
  } catch {
    return null;
  }

  return null;
}

function withImageBase(path: string) {
  if (!IMG_BASE_URL) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${IMG_BASE_URL}${path}`;
  }

  return `${IMG_BASE_URL}${path}`;
}

export function resolveCategoryImageSrc(logoUrl: string | null | undefined) {
  if (!logoUrl) {
    return '/images/fallbacks/no_category.jpg';
  }

  if (
    logoUrl.startsWith('data:') ||
    logoUrl.startsWith('http://') ||
    logoUrl.startsWith('https://')
  ) {
    return logoUrl;
  }

  if (
    logoUrl.startsWith('') ||
    logoUrl.startsWith('categories/') ||
    logoUrl.startsWith('products/')
  ) {
    return withImageBase(logoUrl);
  }

  const decodedLogoUrl = decodeBase64(logoUrl);
  if (!decodedLogoUrl) {
    if (logoUrl.includes(';base64,')) {
      return `data:image/png;${logoUrl}`;
    }
    return `data:image/png;base64,${logoUrl}`;
  }

  if (
    decodedLogoUrl.startsWith('data:') ||
    decodedLogoUrl.startsWith('http://') ||
    decodedLogoUrl.startsWith('https://')
  ) {
    return decodedLogoUrl;
  }

  if (
    decodedLogoUrl.startsWith('/') ||
    decodedLogoUrl.startsWith('categories/') ||
    decodedLogoUrl.startsWith('products/')
  ) {
    return withImageBase(decodedLogoUrl);
  }

  return `data:image/png;base64,${logoUrl}`;
}
