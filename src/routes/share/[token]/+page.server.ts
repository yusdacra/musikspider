import { PUBLIC_MUSIKQUAD_SERVER } from '$env/static/public';
import { LOCAL_MUSIKQUAD_SERVER } from '$env/static/private';
import { scheme } from '../../../utils';

interface MusicInfo {
	title: string;
	album: string;
	artist: string;
}

export async function load({ params }) {
	const token = params.token;
	let color = '#222222';

	const resp = await fetch(`${LOCAL_MUSIKQUAD_SERVER}/share/info/${token}`);
	const info: MusicInfo = await resp.json();

	/*const thumb_resp = await fetch(`${LOCAL_MUSIKQUAD_SERVER}/share/thumbnail/${token}`);
  if (thumb_resp.ok) {
    const thumb = await thumb_resp.blob();
    const rawColor = await getColor(thumb);
    color = rgbToHex(rawColor[0], rawColor[1], rawColor[2]);
  }*/

	return {
		info,
		color,
		thumbnail_url: `${scheme}://${PUBLIC_MUSIKQUAD_SERVER}/share/thumbnail/${token}`,
		audio_url: `${scheme}://${PUBLIC_MUSIKQUAD_SERVER}/share/audio/${token}`
	};
}
