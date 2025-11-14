export const success = (message, data = {}) => ({ status: "success", message, data });
export const error = (message, data = {}) => ({ status: "error", message, data });

export default { success, error };
