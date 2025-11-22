import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import z from 'zod'
import { generateToken } from '@/lib/jwt/jwt-generator'
import { userDb } from '@/lib/db/schema/user'

const CredentialDto = z.object({
    username: z.string(),
    password: z.string(),
})

export const POST = async function(request: NextRequest) {
    const { data, error } = CredentialDto.safeParse(
        await request.json());

    if (error) {
        return Response.json({ message: "Bad Request" }, { status: 400 })
    }

    const user = await userDb().findOneAsync({ username: data.username })
    if (user && bcrypt.compareSync(data.password, user.passwordHash)) {

        return Response.json({
            username: user.username,
            jwt: await generateToken({ _userId: user._id })
        });
    }
    return Response.json({ }, { status: 401 })
}
