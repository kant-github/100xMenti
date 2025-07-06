import Redis from "ioredis";

export const redisClient = new Redis('rediss://default:AYEUAAIjcDFlNzMzOWZlMmVlZjA0M2IxYmU1ZWU3MjA4NjAyYzYyOHAxMA@accepted-lamb-33044.upstash.io:6379')

redisClient.on('connect', () => {
    console.log("Redis is connected");
})

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
})