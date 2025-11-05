import { NextResponse } from 'next/server';


const GOOGLE_CALENDAR_API_KEY = 'AIzaSyCJ-pF3acwnOdyGLiVnKwBD20dVWC2ieu8';
const CALENDAR_ID = 'ef802k6kaolfpd4g6007qhcce8@group.calendar.google.com';
const now = new Date().toISOString();


const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:8100',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
};

export async function GET() {
    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime`
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch events from Google Calendar' },
                { status: response.status, headers: corsHeaders }
            );
        }


        const data = await response.json();

    const events = data.items.map((event: any) => ({
            id: event.id,
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            description: event.description || '',
            location: event.location || '',
        }));

        return NextResponse.json(events, { headers: corsHeaders });
    } 
    
    catch (error) {
        console.log('Das ist ein Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}


