/**
 * Wraps a dynamic import with retry logic + full page reload fallback.
 * Solves "Failed to fetch dynamically imported module" errors that happen
 * when the browser has cached an old version of the app after a deploy.
 */
export function lazyImport(
  importFn: () => Promise<{ default: React.ComponentType }>,
) {
  return async () => {
    try {
      const module = await importFn();
      return { Component: module.default };
    } catch (error) {
      // If this is a chunk load failure, reload the page once
      const hasReloaded = sessionStorage.getItem("chunk-reload");
      if (!hasReloaded) {
        sessionStorage.setItem("chunk-reload", "1");
        window.location.reload();
        // Return a placeholder while reloading
        return { Component: () => null };
      }
      // Already reloaded once — clear flag and let error bubble
      sessionStorage.removeItem("chunk-reload");
      throw error;
    }
  };
}
