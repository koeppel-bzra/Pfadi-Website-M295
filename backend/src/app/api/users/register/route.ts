import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import z from 'zod'
import { generateToken } from '@/lib/jwt/jwt-generator'
import { userDb } from '@/lib/db/schema/user'

/**
 * Validierungs-Schema für Register-Anfrage
 * Erwartet JSON mit { username: string, password: string }
 */
const CredentialDto = z.object({
    username: z.string(),
    password: z.string(),
})

/**
 * POST /api/users/register
 * 
 * Endpoint zur Registrierung eines neuen Benutzers
 * 
 * Anfrage: { username: "testuser", password: "geheim123" }
 * 
 * Erfolg (200):
 * {
 *   "username": "testuser",
 *   "token": "eyJhbGc..." (JWT-Token - sofort angemeldet!)
 * }
 * 
 * Fehler:
 * - 400: Bad Request (ungültiges Format)
 * 
 * WICHTIG: Der neue User bekommt automatisch role: 'user' (NICHT admin!)
 * und wird sofort angemeldet (erhält Token)
 */
export const POST = async function(request: NextRequest) {
    // Validiere Input
    const { data, error } = CredentialDto.safeParse(
        await request.json());

    if (error) {
        return Response.json({ message: "Bad Request" }, { status: 400 })
    }

    // Erstelle neuen User
    // WICHTIG: Passwort wird gehashed mit bcryptSync BEVOR es in DB kommt
    const newUser = await userDb().insertAsync({
        username: data.username,
        passwordHash: bcrypt.hashSync(data.password),  // Hash + speichern in einem Schritt
        role: 'user'                                    // Neue User sind immer 'user', nicht 'admin'
    });
    
    // Gib sofort Token zurück (Auto-Login nach Registration)
    return Response.json({
        username: data.username,
        token: await generateToken({ _userId: newUser._id, role: 'user' })
    });
}