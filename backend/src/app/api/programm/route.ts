import { NextRequest } from "next/server";
import { programmDb } from "@/lib/db/schema/programm";
import { userDb } from "@/lib/db/schema/user";
import { verifyToken } from "@/lib/jwt/jwt-generator";
import { getJwtHeader } from "@/lib/jwt/jwt-auth";
import { Programm } from "@/lib/db/schema/programm";

export async function GET(request: NextRequest) {
    const jwtToken = getJwtHeader(request);
    const payload = await verifyToken(jwtToken);

    const userId = payload._userId as string | undefined;
    const role = payload.role as string | undefined;

    if (!userId) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const filter = role === "admin" ? {} : { _userId: userId };
    const events = await programmDb().findAsync(filter);

    const enrichedEvents = await Promise.all(
        events.map(async (event) => {
            try {
                const user = await userDb().findOneAsync({ _id: event._userId });
                return { ...event, username: user?.username ?? "Unbekannt" };
            } catch {
                return { ...event, username: "Unbekannt" };
            }
        })
    );

    return Response.json(enrichedEvents, { status: 200 });
}

export async function POST(request: NextRequest) {
    const jwtToken = getJwtHeader(request);
    const payload = await verifyToken(jwtToken);

    const userId = payload._userId as string | undefined;

    if (!userId) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, success } = Programm.safeParse(body);

    if (!success) {
        return Response.json({ message: "Invalides DTO Format" }, { status: 400 });
    }

    const dataWithUserId = { ...data, _userId: userId };
    const created = await programmDb().insertAsync(dataWithUserId);

    return Response.json(created, { status: 201 });
}
