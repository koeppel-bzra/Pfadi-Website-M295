import { NextRequest } from "next/server";
import { Programm, programmDb } from "@/lib/db/schema/programm"


declare type PathParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: PathParams) {
    const { id } = await context.params;
    const termin = await programmDb().findOneAsync({ _id: id });

    if (termin) {
        return Response.json(termin, { status: 200 });
    }

    return Response.json(
         { message: 'Termin nicht gefunden' },
         { status: 404 },
    )
}

export async function DELETE(request: NextRequest, context: PathParams) {
    const { id } = await context.params;
    const numRemoved = await programmDb().removeAsync({ _id: id }, { }); // gibt die Anzahl der entfernten Dokumente zurück

    if (numRemoved > 0) {
        return Response.json(
            { message: 'Termin gelöscht' },
            { status: 200 },
        )
    }

    return Response.json(
        { message: 'Termin nicht gefunden' }, 
        { status: 404 },
    )
}

export async function PUT(request: NextRequest, context: PathParams) {
    const { id } = await context.params

    const body = await request.json();
    const parsed = Programm.safeParse(body);

    if (!parsed.success) {
        return Response.json(
            { message: "Ungültige Daten", errors: parsed.error.format() },
            { status: 400 }
        );
    }

    const data = parsed.data;

    const result = await programmDb().updateAsync(
        {_id: id},
        {$set: data}, // Damit nur die angegebenen Felder verändert werden und nicht das ganze Ereignis
        {}
    );

    if (result.numAffected > 0) {
        return Response.json(
            {message: 'Ereignis angepasst'},
            {status: 200},
        );
    }

    return Response.json(
        {message: "Termin nicht gefunden"},
        {status: 404}
    );

}