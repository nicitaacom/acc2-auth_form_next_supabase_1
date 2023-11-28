export const getURL = () => {
  let url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL // Automatically set by Vercel.

  // Make sure to include `https://` when not localhost.
  url = url!.includes("http") ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url!.charAt(url!.length - 1) === "/" ? url : `${url}/`
  return url
}
