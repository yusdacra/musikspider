import { JSX } from "preact";

export default function Center(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class={`flex items-center justify-center h-full w-full ${
        props.class ?? ""
      }`}
    />
  );
}
