const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a file from public/ with the deployment's Next.js base path. */
export function assetPath(path: `/${string}`) {
  return `${basePath}${path}`;
}
