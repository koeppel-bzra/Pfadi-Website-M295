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
    // Versuche JSON zu parsen und gegen Schema zu validieren
    const { data, error } = CredentialDto.safeParse(
        await request.json());

    // Wenn Validation fehlgeschlagen: Bad Request
    if (error) {
        return Response.json({ message: "Bad Request" }, { status: 400 })
    }

    // Suche User in DB mit dem gegebenen Username
    const user = await userDb().findOneAsync({ username: data.username })
    
    // Wenn User existiert UND Passwort korrekt ist:
    if (user && bcrypt.compareSync(data.password, user.passwordHash)) {
        return Response.json({
            username: user.username,
            token: await generateToken({ _userId: user._id, role: user.role })
        });
    }
    

    return Response.json({ message: "Invalid credentials" }, { status: 401 })
}
