export const optimizeImage = (
  url: string | undefined | null,
  width?: number
): string => {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('cloudinary.com')) return url;

  // Remove existing transformation segment if present
  const cleanUrl = url.replace(/\/image\/upload\/(?:[a-zA-Z0-9_,:]+\/)?/, '/image/upload/');

  const params = ['f_auto', 'q_auto'];
  if (width && width > 0) {
    params.push(`w_${width}`, 'c_limit');
  }

  return cleanUrl.replace('/image/upload/', `/image/upload/${params.join(',')}/`);
};