import Journey from "@/components/journey/Journey";
import { profile } from "@/data/portfolio";

const env = (...names: string[]) => names.map((n) => process.env[n]?.trim()).find(Boolean) || undefined;

export default function Page() {
  return (
    <Journey
      links={{
        email: env("CONTACT_EMAIL"),
        phone: env("CONTACT_NUMBER", "CONTACT_NNUMBER"),
        github: env("GITHUB", "GITHUB_URL") ?? profile.github,
        linkedin: env("LINKEDIN_URL", "LINKEDIN"),
        x: env("X_URL", "X") ?? profile.x,
        instagram: env("INSTAGRAM", "INSTAGRAM_URL"),
        threads: env("THREADS", "THREADS_URL"),
      }}
    />
  );
}
