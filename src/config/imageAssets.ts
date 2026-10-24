/**
 * Centralized Image Assets Mapping
 * Adheres strictly to the project image rule:
 * Available assets: 1.png, 2.png, 3.png, 4.png
 * Numerical sequence cycle: images[i % 4]
 */

export const IMAGE_FILENAMES = ['1.png', '2.png', '3.png', '4.png'] as const;

export const IMAGE_ASSETS = IMAGE_FILENAMES.map(
  (filename) => `${import.meta.env.BASE_URL}assets/image/${filename}`
);

/**
 * Returns the image URL corresponding to placement index i,
 * cycling through 1.png, 2.png, 3.png, 4.png in numerical order.
 */
export const getImageByIndex = (index: number): string => {
  const safeIndex = Math.abs(index) % IMAGE_ASSETS.length;
  return IMAGE_ASSETS[safeIndex];
};
