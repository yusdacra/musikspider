import { get, writable } from 'svelte/store';
import { type Track, type TrackId, type TrackWithId, LoopKind } from './types';

import { PUBLIC_MUSIKQUAD_SERVER } from '$env/static/public';
import { scheme } from './utils';

function writableStorage(key: string, defaultValue: string) {
	const store = writable(localStorage.getItem(key) ?? defaultValue);
	store.subscribe((value) => localStorage.setItem(key, value));
	return store;
}

export const address = writableStorage('address', PUBLIC_MUSIKQUAD_SERVER);
export const token = writableStorage('token', '');

export function makeThumbnailUrl(id: number) {
	if (id === 0) {
		return null;
	}
	return `${scheme}://${get(address)}/thumbnail/${id}?token=${get(token)}`;
}

export function makeAudioUrl(id: TrackId) {
	return `${scheme}://${get(address)}/audio/external_id/${id}?token=${get(token)}`;
}

export function makeGenScopedTokenUrl(id: TrackId) {
	return `${scheme}://${get(address)}/share/generate/${id}?token=${get(token)}`;
}

export const currentTrack = writable<TrackWithId | null>(null);

export function getCurrentTrack(
	tracks: Map<TrackId, Track>,
	queue: TrackId[],
	position: number | null
): TrackWithId | null {
	if (position === null) {
		return null;
	}
	const id = queue.at(position);
	if (id === undefined) {
		return null;
	}
	const track = tracks.get(id);
	if (track === undefined) {
		return null;
	}
	return {
		track,
		id
	};
}

export const queuePosition = writable<number | null>(null);
export const queue = writable<TrackId[]>([]);
export const tracks = writable<Map<TrackId, Track>>(new Map());
export const tracksSorted = writable<TrackId[]>([]);

queuePosition.subscribe((pos) => currentTrack.set(getCurrentTrack(get(tracks), get(queue), pos)));
tracks.subscribe((newTracks) =>
	currentTrack.set(getCurrentTrack(newTracks, get(queue), get(queuePosition)))
);

export function setQueuePositionTo(track_id: TrackId) {
	let q = get(queue);
	const position = q.indexOf(track_id);
	if (position !== -1) {
		queuePosition.set(position);
	} else {
		q.push(track_id);
		queue.set(q);
		queuePosition.set(q.length - 1);
	}
}

export function getPrevQueuePosition(respectLoop: boolean) {
	const pos = get(queuePosition);
	if (pos !== null) {
		const q = get(queue);
		const l = get(loop);
		const _newPos = pos - 1;
		const newPos =
			_newPos > -1 ? _newPos : l === LoopKind.Once || !respectLoop ? q.length - 1 : null;
		return newPos;
	}
	return null;
}

export function getNextQueuePosition(respectLoop: boolean) {
	const pos = get(queuePosition);
	if (pos !== null) {
		const q = get(queue);
		const l = get(loop);
		const _newPos = pos + 1;
		const newPos = _newPos < q.length ? _newPos : l === LoopKind.Once || !respectLoop ? 0 : null;
		return newPos;
	}
	return null;
}

export function prevQueuePosition(respectLoop: boolean = false) {
	queuePosition.set(getPrevQueuePosition(respectLoop));
}

export function nextQueuePosition(respectLoop: boolean = false) {
	queuePosition.set(getNextQueuePosition(respectLoop));
}

export const paused = writable<boolean>(false);
export const volume = writable<number>(1.0);
export const muted = writable<boolean>(false);
export const loop = writable<LoopKind>(LoopKind.Off);

export function changeLoop() {
	switch (get(loop)) {
		case LoopKind.Always:
			loop.set(LoopKind.Off);
			break;
		case LoopKind.Off:
			loop.set(LoopKind.Once);
			break;
		case LoopKind.Once:
			loop.set(LoopKind.Always);
			break;
	}
}

export const searchText = writable<string>('');

export function search(q: string) {
	const query = q.trim();
	const t = get(tracks);

	if (query.length === 0) {
		let result: TrackId[] = [];
		t.forEach((_, id) => result.push(id));
		tracksSorted.set(result);
		return;
	}

	const smartCase = query.toLowerCase() === query;

	let result: TrackId[] = [];
	t.forEach((track, id) => {
		if (smartCase) {
			const titleHas = track.title.toLowerCase().includes(query);
			const albumHas = track.album_title.toLowerCase().includes(query);
			const artistHas = track.artist_name.toLowerCase().includes(query);
			if (titleHas || albumHas || artistHas) {
				result.push(id);
			}
		} else {
			const titleHas = track.title.includes(query);
			const albumHas = track.album_title.includes(query);
			const artistHas = track.artist_name.includes(query);
			if (titleHas || albumHas || artistHas) {
				result.push(id);
			}
		}
	});
	tracksSorted.set(result);
}
