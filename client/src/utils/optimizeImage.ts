export const optimizeImage = (url: string | undefined | null): string | undefined => {
  if (!url || typeof url !== 'string') return undefined;
  if (!url.includes('cloudinary.com')) return url;
  if (url.includes('/upload/f_auto')) return url;
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
};