/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
<<<<<<< HEAD
export const publicRoutes = [];
=======
export const publicRoutes = ["/auth/new-verification"];
>>>>>>> 5f93c8a213a0a85b1c493f91c3987f111556edb4

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "/sign-up", "/auth/error", "/auth/reset", "/auth/new-password"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = ["/api"];

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_SIGN_IN_REDIRECT = "/";
export const DEFAULT_SIGN_OUT_REDIRECT = "/sign-in";
export const DEFAULT_AUTH_ERROR_REDIRECT = "/auth-error";
