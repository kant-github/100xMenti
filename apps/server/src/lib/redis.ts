import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;
export const redisClient = new Redis(REDIS_URL);

redisClient.on('connect', () => {
    console.log("Redis is connected");
})

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
})