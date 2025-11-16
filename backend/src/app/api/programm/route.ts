import { NextRequest  } from "next/server";
import { Programm, programmDb } from "@/lib/db/schema/programm"

export async function GET() {
    const termineInDb = await programmDb().findAsync({ })
    return Response.json(termineInDb, {status: 200})
}


export async function POST(request: NextRequest) {
    const { data, success } = Programm.safeParse(await request.json())

    if (!success) {
        return Response.json({ message: 'Invalides DTO Format'}, {status: 400})
    }

    const termineMitId = await programmDb().insertAsync(data)
    return Response.json(termineMitId, { status: 201 })
}