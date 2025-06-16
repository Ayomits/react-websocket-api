import { useEffect, useRef, useState } from "react";
import ReconnectingWebSocket, {
	CloseEvent,
	ErrorEvent,
	Event,
} from "reconnecting-websocket";

const sharedSockets: Set<string> = new Set();

export interface WebsocketConnectionOptions {
	onReady?: (ev: Event) => void;
	onClose?: (ev: CloseEvent) => void;
	onError?: (ev: ErrorEvent) => void;
}

export function useWebsocketConnection(
	url: string,
	options: WebsocketConnectionOptions
) {
	const socket = useRef<ReconnectingWebSocket | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (sharedSockets.has(url)) {
			return;
		}
		if (typeof window === "undefined") {
			return;
		}
		socket.current = new ReconnectingWebSocket(url);
		sharedSockets.add(url);
		socket.current.addEventListener("open", (ev) => {
			setIsReady(true);
			options.onReady?.(ev);
		});
		socket.current.addEventListener("close", (ev) => {
			setIsReady(false);
			options?.onClose?.(ev);
			sharedSockets.delete(url);
		});
		socket.current.addEventListener("error", (ev) => {
			options?.onError?.(ev);
		});
	}, []);

	return { socket, isReady };
}
