import { LOCAL_MUSIKQUAD_SERVER } from '$env/static/private';

interface MusicInfo {
  title: string,
  album: string,
  artist: string,
}

export async function load({ params }) {
  const server = LOCAL_MUSIKQUAD_SERVER;
  const resp = await fetch(`${server}/share/info/${params.token}`);
  const info: MusicInfo = await resp.json();
  return {
    info,
    thumbnail_url: `${server}/share/thumbnail/${params.token}`,
    audio_url: `${server}/share/audio/${params.token}`,
  };
}