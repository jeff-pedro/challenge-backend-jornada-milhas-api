export const APP_NAME = 'Jornada Milhas';
export const FILE_CONSTRAINTS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: 'image/jpeg',
}
export const CACHE_DEFAULTS = {
    TTL: 10000, // 10s
    MAX_ITEMS: 100,
    PORT: 6379
};