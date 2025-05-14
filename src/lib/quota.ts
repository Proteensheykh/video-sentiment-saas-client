import { db } from "~/server/db";

export async function checkAndUpdateQuota(
    userId: string,
    deductFromQuota: boolean = true
): Promise<boolean | undefined> {
    const quota = await db.apiQuota.findUniqueOrThrow({
        where: {userId}
    })

    const now = new Date();
    const lastReset = new Date(quota.lastResetDate)
    const daysSinceLastReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24) // convert to days

    if (daysSinceLastReset >= 30) {
        if (deductFromQuota) {
            await db.apiQuota.update({
                where: {userId},
                data: {
                    lastResetDate: now,
                    requestsUsed: 1
                }
            })
        }
        return true
    } else {
        if (deductFromQuota) {
            if (quota.requestsUsed >= quota.maxRequests) {
                return false
            }

            await db.apiQuota.update({
                where: {userId},
                data: {
                    requestsUsed: quota.requestsUsed + 1
                }
            })

            return true
        }
    }


}