export const APP_DEFAULTS = {
    NAME: 'Jornada Milhas API',
    URL: 'http://localhost:3000/',
    GLOBAL_PREFIX: '/api/v1',
}
export const FILE_CONSTRAINTS = {
    MAX_SIZE: 1024 * 1024, // 1MB
    ALLOWED_TYPES: /^image\/(jpe?g|png)$/i,
}
export const CACHE_DEFAULTS = {
    TTL: 10000, // 10s
    MAX_ITEMS: 100,
    PORT: 6379
};
export const SWAGGER_URL = '/docs'
