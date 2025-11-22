import { NextRequest  } from "next/server";
import { Programm, programmDb } from "@/lib/db/schema/programm"
import { verifyToken } from "@/lib/jwt/jwt-generator";
import { getJwtHeader } from "@/lib/jwt/jwt-auth";

export async function GET(request: NextRequest) {
    //Zugriff nur für angemeldete Benutzer
    const jwtToken = getJwtHeader(request)
    const { _userId, role } = await verifyToken(jwtToken)

    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }


    const termineInDb = await programmDb().findAsync({ _userId }) // In FindAsync steht jetzt _userId, damit nur die eigenen Termine geholt werden
    return Response.json(termineInDb, {status: 200})
}


export async function POST(request: NextRequest) {
    //Zugriff nur für angemeldete Benutzer
    const jwtToken = getJwtHeader(request)
    const { _userId, role } = await verifyToken(jwtToken)

    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }
    

    const { data, success } = Programm.safeParse(await request.json())

    if (!success) {
        return Response.json({ message: 'Invalides DTO Format'}, {status: 400})
    }

    data._userId = String(_userId); // Setze die _userId des angemeldeten Benutzers

    const termineMitId = await programmDb().insertAsync(data)
    return Response.json(termineMitId, { status: 201 })
}