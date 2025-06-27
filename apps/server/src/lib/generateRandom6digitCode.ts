import { prisma } from "./prisma";

export default async function generateRandom6digitCode() {
    const MAX_ATTEMPTS = 10;
    const i = 0;

    while (i < MAX_ATTEMPTS) {
        const code = Math.random().toString().substring(2, 8)
        const liveSession = await prisma.liveSession.findFirst({
            where: {
                sessionCode: code
            }
        });
        if (!liveSession) {
            return code
        }
    }
    throw new Error('Unable to generate unique session code');
}