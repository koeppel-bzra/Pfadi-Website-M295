import { JWTPayload, SignJWT, jwtVerify } from 'jose'

/**
 * Cryptographischer Schlüssel für JWT-Signing
 * Wird verwendet um Tokens zu erstellen und zu validieren (HMAC-SHA256)
 * WICHTIG: In Production sollte dieser aus Umgebungsvariablen kommen, NICHT hardcoded!
 */
const cryptoKey = new TextEncoder().encode(
'08bca4435f1a4c46801691c859ce504716fd68fd113d43ecbc2754649ee'
+ '401f7380ac84e877a481f84a3ec8c530851958773d1af93bf4b4cba15'
+ 'bd04c627de01' )

/**
 * Generiert einen signierten JWT-Token
 * 
 * @param claims - Die Daten die im Token enthalten sein sollen (z.B. { _userId: "123", role: "admin" })
 * @returns Ein signierter JWT-String (z.B. für Authorization Header)
 * 
 * Token-Details:
 * - Algorithm: HS256 (HMAC mit SHA-256)
 * - Ablauf: 30 Tage
 * - Issuer/Audience: Identifiziert die App
 */
export async function generateToken(claims: JWTPayload) : Promise<string> {
    return new SignJWT(claims)
        .setProtectedHeader({ alg: 'HS256' })  // Algorithmus für Signatur
        .setIssuedAt()                           // Zeitstempel: Wann wurde Token erstellt
        .setIssuer('urn:bwz-rappi-m295.example.com')  // Wer hat den Token ausgestellt
        .setExpirationTime('30d')               // Token verfällt nach 30 Tagen
        .setAudience(`urn:bwz-rappi-m295.example.com`) // Für wen ist dieser Token
        .sign(cryptoKey)                         // Mit Schlüssel signieren
    }

/**
 * Validiert einen JWT-Token
 * 
 * @param jwtToken - Der Token von vorne (nach "Bearer ")
 * @returns Die Payload/Claims die im Token codiert sind, oder leeres Objekt wenn ungültig
 * 
 * WICHTIG: Diese Funktion gibt immer ein Objekt zurück, auch bei Fehler!
 * Das bedeutet: Du musst selbst prüfen ob _userId existiert
 */
export async function verifyToken(jwtToken: string)
    : Promise<JWTPayload> {

    try {
        // Verifyzen (=validieren) des Tokens mit unserem Geheimschlüssel
        const { payload } = await jwtVerify(jwtToken, cryptoKey,
        { algorithms: [ 'HS256' ] } )
        return payload // Gibt die Daten zurück die im Token waren
    } 
    
    catch {
        // Bei Fehler (ungültig, abgelaufen, etc): Leeres Objekt zurück
        // Dies wird im Route als !_userId geprüft um Unauthorized (401) zu senden
        return { }
    }
}
