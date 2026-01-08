import { getRefreshTokenExpiresAt } from '../services/tokenService.js';

export const REFRESH_COOKIE_NAME = 'refreshToken';

const getCookieOptions = () => {
    const secure =
        process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure,
        sameSite: 'strict',
        path: '/api/auth'
    };
};

export const setRefreshCookie = (res, refreshToken) => {
    const options = getCookieOptions();
    options.expires = getRefreshTokenExpiresAt(refreshToken);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, options);
};

export const clearRefreshCookie = (res) => {
    res.clearCookie(REFRESH_COOKIE_NAME, getCookieOptions());
};
