import { PATH } from "./utils/constants"

/**
 * An array of routes that are accessible to the public.
 * Those routes do not require authentication.
 * @type {string[]} 
 */

export const publicRoutes = [
    PATH.HOME_PATH,
    PATH.NEW_VERIFICATION_PATH,
]

/**
 * An array of routes that are used for authentication.
 * Those routes will redirect logged in users to /settings.
 * @type {string[]} 
 */

export const authRoutes = [
    PATH.LOGIN_PATH,
    PATH.REGISTER_PATH,
    PATH.ERROR_PATH,
    PATH.RESET_PASSWORD_PATH,
    PATH.NEW_PASSWORD_PATH,
]

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = PATH.API_BASE_URL


/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = PATH.SETTINGS_PATH