/**
 * Resolves static public asset URLs with Vite's BASE_URL
 * Ensures assets and audio resolve cleanly both locally and on GitHub Pages subpaths.
 */
export const getAssetUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${cleanBase}${cleanPath}`;
};
