import { createSign, createVerify } from "crypto";

export type JwtClaims = {
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
const jwtHeader = btoa(
  JSON.stringify({
    alg: "HS256",
    typ: "JWT",
  }),
);

function jwtSignature(data: string): string {
  const sign = createSign("SHA256");
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey, "base64");
  return signature;
}

export function createJwt(claims: JwtClaims): string {
  claims.expiration = new Date();
  claims.expiration.setDate(claims.expiration.getDate() + 4); // expiration in days

  const data = btoa(JSON.stringify(claims));
  return `${jwtHeader}.${data}.${jwtSignature(data)}`;
}

export type VerifyJwtRes = {
  verified: boolean;
  claims?: JwtClaims;
};

export function verifyJwt(jwt: string): VerifyJwtRes {
  const jwtParts = jwt.split(".");
  if (jwtParts.length !== 3) {
    return { verified: false };
  }
  const data = jwtParts[1];
  const signature = jwtParts[2];

  const verify = createVerify("SHA256");
  verify.update(data);
  verify.end();

  if (!verify.verify(publicKey, signature, "base64")) {
    return { verified: false };
  }

  return { verified: true, claims: JSON.parse(atob(data)) };
}
