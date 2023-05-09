export type ResourceId = bigint;
export type TrackId = string;

export interface Track {
	id: number;
	title: string;
	track_num: number;
	album_title: string;
	album_id: ResourceId;
	artist_name: string;
	artist_id: ResourceId;
	thumbnail_id: number;
}

export interface TrackWithId {
	id: TrackId;
	track: Track;
}

export interface Artist {
	name: string;
}

export interface Album {
	title: string;
	artist_id: ResourceId;
}

export enum LoopKind {
	Off,
	Once,
	Always
}
