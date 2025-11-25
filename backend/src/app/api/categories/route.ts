import { NextRequest  } from "next/server";
import { Kategorie, kategorieDb } from "@/lib/db/schema/categories";
import { verifyToken } from "@/lib/jwt/jwt-generator";
import { getJwtHeader } from "@/lib/jwt/jwt-auth";


export async function GET() {
    const kategorienInDb = await kategorieDb().findAsync({ });
    return Response.json(kategorienInDb, { status: 200 })
}


export async function POST(request: NextRequest) {
    // Authentifizierung erforderlich
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string

    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Validiere Input
    const { data, success } = Kategorie.safeParse(await request.json())

    if (!success) {
        return Response.json({ message: 'Nicht gültiges DTO Format' }, { status: 400 })
    }

    // Speichere neue Kategorie
    const kategorienInDb = await kategorieDb().insertAsync(data)
    return Response.json(kategorienInDb, {status: 201})
}




