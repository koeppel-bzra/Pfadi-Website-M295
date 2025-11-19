import { NextRequest  } from "next/server";
import { Kategorie, kategorieDb } from "@/lib/db/schema/categories";

declare type Pathparams = { params: Promise<{ id: string }>}

export async function GET() {
    const kategorienInDb = await kategorieDb().findAsync({ });
    return Response.json(kategorienInDb, { status: 200 })
}

export async function POST(request: NextRequest) {
    const { data, success } = Kategorie.safeParse(await request.json())

    if (!success) {
        return Response.json({ message: 'Nicht gültiges DTO Format' }, { status: 400 })
    }

    const kategorienInDb = await kategorieDb().insertAsync(data)
    return Response.json(kategorienInDb, {status: 200})
}




