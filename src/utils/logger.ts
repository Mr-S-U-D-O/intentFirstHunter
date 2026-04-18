/**
 * Centralized logging utility for the frontend.
 * Sends errors to the backend for storage in Firestore.
 */

export async function reportError(error: Error | string, context: Record<string, any> = {}) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : null;
  
  console.error(`[Frontend Error] ${message}`, { context, stack });

  try {
    await fetch('/api/report-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: message,
        stack,
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          ...context
        }
      })
    });
  } catch (e) {
    // Silent fail if reporting fails
    console.warn('[Logger] Failed to report error to backend:', e);
  }
}
