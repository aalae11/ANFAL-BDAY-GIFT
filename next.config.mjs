/** @type {import('next').NextConfig} */
function normalizeBasePath(value = "") {
  const cleaned = value.trim().replace(/^\/+|\/+$/g, "");
  return cleaned ? `/${cleaned}` : "";
}

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPage = repositoryName.endsWith(".github.io");
const githubPagesBasePath =
  process.env.GITHUB_ACTIONS === "true" && repositoryName && !isUserOrOrgPage ? `/${repositoryName}` : "";
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? githubPagesBasePath);

const nextConfig = {
  assetPrefix: basePath || undefined,
  basePath: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  output: "export",
  reactStrictMode: true,
  trailingSlash: true
};

export default nextConfig;
