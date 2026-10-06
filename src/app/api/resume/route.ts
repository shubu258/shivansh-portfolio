// Streams a resume from its env URL so the browser downloads it directly,
// even when the file lives on another origin (Google Drive, S3, GitHub, …).
// /api/resume?type=blockchain | fullstack   — add `&view` to open it inline instead.

const RESUMES = {
  blockchain: { env: "BLOCKCHAIN_DEVELOPER_RESUME_URL", filename: "shivansh-blockchain-developer.pdf" },
  fullstack: { env: "FULLSTACK_BLOCKCHAIN_DEVELOPER_RESUME_URL", filename: "shivansh-fullstack-blockchain-developer.pdf" },
} as const;

function toDirectUrl(raw: string, base: string): string {
  const url = new URL(raw, base);

  // drive.google.com/file/d/<id>/view  ->  direct download
  const driveFile = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (url.hostname === "drive.google.com" && driveFile) {
    return `https://drive.google.com/uc?export=download&id=${driveFile[1]}`;
  }
  // docs.google.com/document/d/<id>/edit  ->  PDF export
  const doc = url.pathname.match(/\/document\/d\/([^/]+)/);
  if (url.hostname === "docs.google.com" && doc) {
    return `https://docs.google.com/document/d/${doc[1]}/export?format=pdf`;
  }
  return url.toString();
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const type = params.get("type") === "blockchain" ? "blockchain" : "fullstack";
  const { env, filename } = RESUMES[type];
  const raw = process.env[env]?.trim();
  if (!raw) {
    return new Response(`Resume link is not configured. Set ${env} in .env.local.`, { status: 404 });
  }

  const source = toDirectUrl(raw, request.url);
  const view = params.has("view");

  try {
    const upstream = await fetch(source, { redirect: "follow", cache: "no-store" });
    const upstreamType = upstream.headers.get("content-type") ?? "";
    // Drive serves files as octet-stream; label them as PDF so "Preview" opens inline.
    const contentType = !upstreamType || upstreamType.includes("octet-stream") ? "application/pdf" : upstreamType;

    // Private/unsupported links usually answer with an HTML page — hand the visitor
    // the original link rather than a broken file.
    if (!upstream.ok || !upstream.body || contentType.includes("text/html")) {
      return Response.redirect(new URL(raw, request.url), 302);
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${view ? "inline" : "attachment"}; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return Response.redirect(new URL(raw, request.url), 302);
  }
}
