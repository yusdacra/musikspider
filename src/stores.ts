import { get, readable, writable, type Writable } from 'svelte/store';
import type { ResourceId, Track, TrackWithId } from './types';

function writableStorage(key: string, defaultValue: string) {
  const store = writable(localStorage.getItem(key) ?? defaultValue);
  store.subscribe(value => localStorage.setItem(key, value));
  return store;
}

export const address = writableStorage("address", "127.0.0.1:5505");
export const token = writableStorage("token", "");

export function makeThumbnailUrl(id: ResourceId) {
  return `http://${get(address)}/thumbnail/${id}?token=${get(token)}`;
}

export function makeAudioUrl(id: ResourceId) {
  return `http://${get(address)}/audio/id/${id}?token=${get(token)}`;
}

export const currentTrack = writable<TrackWithId | null>(null);

export function getCurrentTrack(tracks: Map<ResourceId, Track>, queue: ResourceId[], position: number | null): TrackWithId | null {
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
    id,
  };
}

export const queuePosition = writable<number | null>(null);
export const queue = writable<ResourceId[]>([]);
export const tracks = writable<Map<ResourceId, Track>>(new Map());
export const tracksSorted = writable<Map<number, ResourceId>>(new Map());

queuePosition.subscribe((pos) => currentTrack.set(getCurrentTrack(get(tracks), get(queue), pos)));
tracks.subscribe((newTracks) => currentTrack.set(getCurrentTrack(newTracks, get(queue), get(queuePosition))));

export const volume = writable<number>(1.0);