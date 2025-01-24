export default async function exchangeGoogleCode(
  code: string,
): Promise<string> {
  const queryParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
  });
  const res = await fetch(
    `https://oauth2.googleapis.com/token?${queryParams.toString()}`,
    {
      method: "POST",
    },
  );
  const data = await res.json();

  return data.access_token as string;
}
