import Redis from "ioredis";

export const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
})

redisClient.on('connect', () => {
    console.log("Redis is connected");
})

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
})