import { NextRequest } from 'next/server'

/**
 * Extrahiert den JWT-Token aus dem Authorization Header
 * 
 * Erwartet Format: "Authorization: Bearer <token>"
 * 
 * @param request - NextJS Request Object
 * @returns Der Token ohne "Bearer " Präfix, oder leerer String wenn nicht vorhanden
 * 
 * Beispiel:
 * - Input Header: "Bearer abc123xyz..."
 * - Output: "abc123xyz..."
 * - Input Header: nicht vorhanden
 * - Output: ""
 */
export function getJwtHeader(request: NextRequest): string {
  const authHeader = request.headers.get('authorization')
  // Wenn Authorization Header existiert, entferne die ersten 7 Zeichen ("Bearer ")
  // Sonst gib leeren String zurück
  return authHeader ? authHeader.slice('Bearer '.length) : ''
}
