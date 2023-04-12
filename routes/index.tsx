import { getCookies } from "$std/http/cookie.ts";

export function handler(req: Request): Response {
  const cookies = getCookies(req.headers);
  const username = cookies["username"];
  const password = cookies["password"];

  if (username != null && password != null) {
    return new Response("", {
      status: 303,
      headers: { location: "/library" },
    });
  } else {
    return new Response("", {
      status: 303,
      headers: { location: "/login" },
    });
  }
}
