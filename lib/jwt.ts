import { createHmac } from "crypto";
import { base64UrlDecode, base64UrlEncode } from "./b64";

export type AuthClaims = {
  name: string;
  email: string;
  expiration?: Date;
};

const privateKey = process.env.PRIVATE_KEY as string;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is undefined");
}
const publicKey = process.env.PUBLIC_KEY as string;
if (!publicKey) {
  throw new Error("PUBLIC_KEY is undefined");
}

function jwtSignature(data: string): string {
  return createHmac("sha256", privateKey)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createJwt(claims: AuthClaims): string {
  if (claims.expiration === undefined) {
    claims.expiration = new Date();
    claims.expiration.setDate(claims.expiration.getDate() + 4); // expiration in days
  }

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify(claims));
  const signature = jwtSignature(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
}

export type VerifyJwtRes = {
  verified: boolean;
  claims?: AuthClaims;
};

export function verifyJwt(jwt: string): VerifyJwtRes {
  const jwtParts = jwt.split(".");
  if (jwtParts.length !== 3) {
    return { verified: false };
  }

  const header = jwtParts[0];
  const payload = jwtParts[1];
  const signature = jwtParts[2];

  if (signature !== jwtSignature(`${header}.${payload}`)) {
    return { verified: false };
  }

  try {
    const claims = JSON.parse(base64UrlDecode(payload));

    if (!claims.expiration || claims.expiration < new Date()) {
      return { verified: false };
    }

    return { verified: true, claims };
  } catch {
    console.log("invalid json in jwt");
    return { verified: false };
  }
}
