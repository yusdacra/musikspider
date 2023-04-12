import { setCookie } from "$std/http/cookie.ts";
import { Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import Button from "../components/Button.tsx";
import Input from "../components/Input.tsx";

const LOGIN_MAX_AGE = 60 * 60 * 24 * 7;

export const handler: Handlers = {
  GET(_, ctx) {
    return ctx.render();
  },
  async POST(req, _) {
    const form = await req.formData();
    const username = form.get("username")!.toString();
    const password = form.get("password")!.toString();

    const response = new Response("", {
      status: 303,
      headers: { location: "/library" },
    });
    setCookie(response.headers, {
      name: "username",
      value: username,
      maxAge: LOGIN_MAX_AGE,
      httpOnly: true,
    });
    setCookie(response.headers, {
      name: "password",
      value: password,
      maxAge: LOGIN_MAX_AGE,
      httpOnly: true,
    });
    return response;
  },
};

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>musikspider</title>
      </Head>
      <div class="flex items-center justify-center p-4 mx-auto max-w-screen-md h-screen">
        <form method="POST">
          <div class="flex flex-col gap-2 max-w-xs">
            <div class="flex gap-4 place-items-center">
              <label for="username" class="w-1/3">username</label>
              <Input
                class="w-2/3"
                id="username"
                type="text"
                name="username"
                required
              />
            </div>
            <div class="flex gap-4 place-items-center">
              <label for="password" class="w-1/3">password</label>
              <Input
                class="w-2/3"
                id="password"
                type="password"
                name="password"
                required
              />
            </div>
            <Button class="w-min" type="submit">login</Button>
          </div>
        </form>
      </div>
    </>
  );
}
