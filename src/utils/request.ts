export default async function request(url: string, requestInit: RequestInit) {
  if (url.startsWith('/')) {
    url = process.env.NEXT_PUBLIC_API_URL + url
  }
  const resp = await fetch(url, requestInit)

  return resp
}
