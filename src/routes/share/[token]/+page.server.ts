import { PUBLIC_MUSIKQUAD_SERVER } from '$env/static/public';
import { LOCAL_MUSIKQUAD_SERVER } from '$env/static/private';
import { scheme } from '../../../utils';

interface MusicInfo {
  title: string,
  album: string,
  artist: string,
}

export async function load({ params }) {
  const resp = await fetch(`${LOCAL_MUSIKQUAD_SERVER}/share/info/${params.token}`);
  const info: MusicInfo = await resp.json();
  return {
    info,
    thumbnail_url: `${scheme}://${PUBLIC_MUSIKQUAD_SERVER}/share/thumbnail/${params.token}`,
    audio_url: `${scheme}://${PUBLIC_MUSIKQUAD_SERVER}/share/audio/${params.token}`,
  };
}