import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Head } from "$fresh/runtime.ts";

interface Data {
  username: string;
  password: string;
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const username = cookies["username"];
    const password = cookies["password"];

    if (username && password) {
      return ctx.render({ username, password });
    } else {
      return new Response("", {
        status: 303,
        headers: { location: "/login" },
      });
    }
  },
};

export default function LibraryPage({ data }: PageProps<Data>) {
  const { username, password } = data;
  return (
    <>
      <Head>
        <title>musikspider</title>
      </Head>
      <p>Library {username} {password}</p>
    </>
  );
}
