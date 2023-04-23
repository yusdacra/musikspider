export type ResourceId = bigint;

export interface Track {
  title: string,
  track_num: number,
  album_title: string,
  album_id: ResourceId,
  artist_name: string,
  artist_id: ResourceId,
  thumbnail_id: ResourceId,
}

export interface TrackWithId {
  id: ResourceId,
  track: Track,
}

export interface Artist {
  name: string,
}

export interface Album {
  title: string,
  artist_id: ResourceId,
}