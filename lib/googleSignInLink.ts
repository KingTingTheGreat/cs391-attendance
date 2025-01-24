export default function googleSignInLink(): string {
  const queryParams = new URLSearchParams({
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
  });

  return `https://accounts.google.com/o/oauth2/auth?${queryParams.toString()}`;
}
