type Props = {
  className?: string;
  label?: string;
};

export default function StravaConnectButton({
  className = "primary-button",
  label = "Connect with Strava",
}: Props) {
  const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID as string | undefined;
  if (!clientId) return null;

  const redirectUri = `${window.location.origin}/auth/callback`;
  const scope = ["read", "activity:read_all"].join(",");

  const authorizeUrl =
    `https://www.strava.com/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&approval_prompt=auto` +
    `&scope=${encodeURIComponent(scope)}`;

  return (
    <a href={authorizeUrl} className={className}>
      {label}
    </a>
  );
}