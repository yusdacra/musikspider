import { PUBLIC_MUSIKQUAD_SERVER } from '$env/static/public';
import { scheme } from '../../../utils';

interface MusicInfo {
  title: string,
  album: string,
  artist: string,
}

export async function load({ params }) {
  const server = PUBLIC_MUSIKQUAD_SERVER;
  const resp = await fetch(`${scheme}://${server}/share/info/${params.token}`);
  const info: MusicInfo = await resp.json();
  return {
    info,
    thumbnail_url: `${scheme}://${server}/share/thumbnail/${params.token}`,
    audio_url: `${scheme}://${server}/share/audio/${params.token}`,
  };
}