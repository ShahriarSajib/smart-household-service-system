// Simple logger wrapper (expandable)
export const info = (...args) => console.log("[INFO]", ...args);
export const warn = (...args) => console.warn("[WARN]", ...args);
export const err = (...args) => console.error("[ERROR]", ...args);

export default { info, warn, err };
