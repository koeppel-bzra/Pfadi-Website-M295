import { NextRequest } from 'next/server'
import z from 'zod'
import bcrypt from 'bcryptjs'
import { getJwtHeader } from '@/lib/jwt/jwt-auth'
import { verifyToken } from '@/lib/jwt/jwt-generator'
import { userDb } from '@/lib/db/schema/user'

/**
 * PATCH /api/users/profile
 *
 * Authenticated endpoint zum Ändern des eigenen Benutzernamens und Passworts.
 * Erwartet Authorization: Bearer <token>
 * Body: { username?: string, password?: string }
 */
const ProfileDto = z.object({
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
})

export const PATCH = async function(request: NextRequest) {
  // Token aus Header extrahieren
  const token = getJwtHeader(request)
  const payload = token ? await verifyToken(token) : { }

  // Prüfe ob Token gültig und _userId vorhanden
  // verifyToken liefert {} bei ungültigem Token
  // @ts-ignore
  const userId = payload._userId as string | undefined
  if (!userId) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // Validierung des Bodies
  const { data, error } = ProfileDto.safeParse(await request.json())
  if (error) {
    return Response.json({ message: 'Bad Request' }, { status: 400 })
  }

  // Mindestens eines der Felder muss vorhanden sein
  if (!data.username && !data.password) {
    return Response.json({ message: 'No changes provided' }, { status: 400 })
  }

  // Wenn username gesetzt ist: prüfen ob anderer User diesen Namen bereits hat
  if (data.username) {
    const existing = await userDb().findOneAsync({ username: data.username })
    if (existing && existing._id !== userId) {
      return Response.json({ message: 'Username already taken' }, { status: 409 })
    }
  }

  // Baue Update-Objekt
  const update: any = {}
  if (data.username) update.username = data.username
  if (data.password) update.passwordHash = bcrypt.hashSync(data.password)

  // Führe Update in DB aus
  try {
    await userDb().updateAsync({ _id: userId }, { $set: update })
    return Response.json({ username: data.username ?? 'unchanged' })
  } catch (e) {
    return Response.json({ message: 'Update failed' }, { status: 500 })
  }
}
