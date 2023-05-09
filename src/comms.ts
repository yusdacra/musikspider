import { dev } from '$app/environment';
import type { TrackWithId } from './types';

const API_VERSION: number = 20;
const HTTP_DISABLED_ERROR: string =
	'server does not have HTTP resources enabled, you will not be able to stream music';
const SERVER_API_INCOMPATIBLE_ERROR: (serverApi: number) => string = (serverApi) =>
	`server API version (${serverApi}) is different from our supported version (${API_VERSION})`;

interface Message {
	name: string;
	id: string;
	device_id: string;
	type: MessageType;
	options: any;
}
type MessageType = 'request' | 'response' | 'broadcast';
type RequestCallback = (arg0: Message | null) => void;

interface Callbacks {
	onDisconnect: (authenticated: boolean, reason: string) => void;
	onConnect: (initial: Message) => void;
	onIncompatible: (reason: string) => void;
}

export class MetadataCommunicator {
	ws: WebSocket | null;
	deviceId: string;
	callbacks: Map<string, RequestCallback>;
	authenticated: boolean;
	eventCallbacks: Callbacks;
	onConnectCallbacks: (() => void)[];

	constructor() {
		this.callbacks = new Map();
		this.deviceId = crypto.randomUUID();
		this.authenticated = false;
		this.eventCallbacks = {
			onDisconnect: () => {},
			onConnect: () => {},
			onIncompatible: () => {}
		};
		this.onConnectCallbacks = [];
		this.ws = null;
	}

	setCallbacks(callbacks: Callbacks) {
		this.eventCallbacks = callbacks;
	}

	connect(address: string, password: string) {
		this.close();

		const scheme = dev ? 'ws' : 'wss';
		this.ws = new WebSocket(`${scheme}://${address}`);

		this.ws.addEventListener('open', (event) => {
			this.makeRequest('authenticate', 'request', { password }, (msg) => {
				if (msg!.options.authenticated) {
					this.authenticated = true;
					this.eventCallbacks.onConnect(msg!);
					this.onConnectCallbacks.forEach((f) => f());
					this.onConnectCallbacks = [];
					if (!msg!.options.environment.http_server_enabled) {
						this.eventCallbacks.onIncompatible(HTTP_DISABLED_ERROR);
					}
					const serverApiVersion = msg!.options.environment.api_version;
					if (serverApiVersion != API_VERSION) {
						this.eventCallbacks.onIncompatible(SERVER_API_INCOMPATIBLE_ERROR(serverApiVersion));
					}
				}
			});
		});
		this.ws.addEventListener('close', (event) => {
			this.eventCallbacks.onDisconnect(this.authenticated, `${event.reason} (code ${event.code})`);
			this.authenticated = false;
		});

		this.ws.addEventListener('message', (event) => {
			const parsed: Message = JSON.parse(event.data);
			const maybeCallback = this.callbacks.get(parsed.id);
			if (maybeCallback) {
				maybeCallback(parsed);
				this.callbacks.delete(parsed.id);
			}
		});
	}

	fetchTracksCount(): Promise<number> {
		const options = { count_only: true };
		const th = this;
		return new Promise(function (resolve, reject) {
			th.makeRequest('query_tracks', 'request', options, (resp) => {
				if (resp) {
					resolve(resp.options.count);
				} else {
					reject(null);
				}
			});
		});
	}

	fetchTracks(limit: number, offset: number, filter: string | null = null): Promise<TrackWithId[]> {
		const options: any = { limit, offset };
		if (filter !== null) options.filter = filter;

		const th = this;
		return new Promise(function (resolve, reject) {
			th.makeRequest('query_tracks', 'request', options, (resp) => {
				if (resp) {
					const data: any[] = resp.options.data;
					resolve(
						data.map((t) => ({
							id: t.external_id,
							track: {
								id: t.id,
								title: t.title,
								track_num: t.track,
								album_title: t.album,
								album_id: t.album_id,
								artist_name: t.artist,
								artist_id: t.artist_id,
								thumbnail_id: t.thumbnail_id
							}
						}))
					);
				} else {
					reject(null);
				}
			});
		});
	}

	private makeRequest(name: string, type: MessageType, options: object, callback: RequestCallback) {
		// return if not authenticated, allow authentication messages
		if (this.isClosed() || (!this.authenticated && name != 'authenticate')) {
			callback(null);
			return;
		}
		// Unique enough for our purposes (as request ID)
		const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
		this.callbacks.set(id, callback);
		const payload = JSON.stringify({
			name,
			type,
			options,
			device_id: this.deviceId,
			id
		});
		console.trace('sending metadata message: ' + payload);
		this.ws!.send(payload);
	}

	close() {
		if (this.isClosed()) return;
		this.ws!.close();
		this.authenticated = false;
		this.callbacks.clear();
	}

	isClosed() {
		return (
			this.ws === null ||
			this.ws.readyState === WebSocket.CLOSED ||
			this.ws.readyState === WebSocket.CLOSING
		);
	}

	onConnect(cb: () => Promise<void>) {
		if (!this.isClosed() && this.authenticated) {
			cb();
		} else {
			this.onConnectCallbacks = [...this.onConnectCallbacks, cb];
		}
	}
}
