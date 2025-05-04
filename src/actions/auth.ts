"use server"

import { hash } from "bcryptjs";
import { signupSchema, type SignupSchema } from "~/schemas/auth";
import { db } from "~/server/db";

export async function  registerUser(data: SignupSchema) {
    try {
        // server-side validation
        const result = signupSchema.safeParse(data)
        if (!result.success) {
            return {error: "Invalid data"}
        }

        const {name, email, password} = data

        // check user exists
        const userExists = await db.user.findUnique({
            where: {email}
        })

        if (userExists) {
            return {error: "User already exist"}
        }

        // encrypt password
        const hashedPassword = await hash(password,12)

        // create user
        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        return { success: true }

    } catch (error) {
        return {error: "Something went wrong"}
    }
}