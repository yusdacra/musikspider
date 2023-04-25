import { writable } from 'svelte/store';
import type { ResourceId, Track, TrackWithId } from './types';

function writableStorage(key: string, defaultValue: string) {
  const store = writable(localStorage.getItem(key) ?? defaultValue);
  store.subscribe(value => localStorage.setItem(key, value));
  return store;
}

export function makeThumbnailUrl(address: string, token: string, id: ResourceId) {
  return `http://${address}/thumbnail/${id}?token=${token}`;
}

export function makeAudioUrl(address: string, token: string, id: ResourceId) {
  return `http://${address}/audio/id/${id}?token=${token}`;
}

export const address = writableStorage("address", "127.0.0.1:5505");
export const token = writableStorage("token", "");

export const tracks = writable<Map<ResourceId, Track>>(new Map());
export const tracksSorted = writable<Map<number, ResourceId>>(new Map());

export const playingNow = writable<TrackWithId | null>(null);