import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import z from 'zod'
import { generateToken } from '@/lib/jwt/jwt-generator'
import { userDb } from '@/lib/db/schema/user'

/**
 * Validierungs-Schema für Login-Anfrage
 * Erwartet JSON mit { username: string, password: string }
 */
const CredentialDto = z.object({
    username: z.string(),
    password: z.string(),
})

/**
 * POST /api/users/login
 * 
 * Endpoint zum Anmelden eines Benutzers
 * 
 * Anfrage: { username: "admin", password: "user1234" }
 * 
 * Erfolg (200):
 * {
 *   "username": "admin",
 *   "token": "eyJhbGc..." (JWT-Token)
 * }
 * 
 * Fehler:
 * - 400: Bad Request (ungültiges Format)
 * - 401: Unauthorized (falsches Passwort oder User nicht existiert)
 */
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
        // compareSync vergleicht Plaintext-Passwort mit Hash (bcrypt macht das automatisch)

        // Gib Token zurück mit User-ID und Role
        return Response.json({
            username: user.username,
            token: await generateToken({ _userId: user._id, role: user.role })
        });
    }
    
    // Ansonsten: Unauthorized (wir unterscheiden nicht zwischen "User nicht existiert" 
    // und "Passwort falsch" aus Sicherheitsgründen!)
    return Response.json({ message: "Invalid credentials" }, { status: 401 })
}
