import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-for-local-dev";
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

export async function createSession(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySession(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
