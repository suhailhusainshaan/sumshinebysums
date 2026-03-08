export const getAssetPath = (path: string): string => {
  // Check if we are in production (GitHub Pages)
  const isProd = process.env.NODE_ENV === 'production';

  // Your GitHub repository name
  const repoName = '/sumshinebysums';

  // If the path already starts with http, return it as is
  if (path.startsWith('http')) return path;

  // Ensure the path starts with a leading slash for consistency
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // In production, prepend the repo name. Locally, return the clean path.
  return isProd ? `${repoName}${cleanPath}` : cleanPath;
};
