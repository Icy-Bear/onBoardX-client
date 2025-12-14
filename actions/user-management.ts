"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function banUser(userId: string, reason: string) {
    try {
        await db.update(user)
            .set({
                banned: true,
                banReason: reason
            })
            .where(eq(user.id, userId));

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to ban user:", error);
        return { success: false, error: "Failed to ban user" };
    }
}

export async function unbanUser(userId: string) {
    try {
        await db.update(user)
            .set({
                banned: false,
                banReason: null
            })
            .where(eq(user.id, userId));

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to unban user:", error);
        return { success: false, error: "Failed to unban user" };
    }
}

export async function getBannedUsers() {
    try {
        const bannedUsers = await db.select()
            .from(user)
            .where(eq(user.banned, true));
        return bannedUsers;
    } catch (error) {
        console.error("Failed to fetch banned users:", error);
        return [];
    }
}
