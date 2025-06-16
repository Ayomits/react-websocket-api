# react-websocket-api

This library solve problem with connect to websocket and comfortable work with him

> Copy and paste everything in /src to your project, don't increase your bundle size <3

> Note
> For reconnecting uses [reconnecting-websocket](https://www.npmjs.com/package/reconnecting-websocket) library <br>
> Thx, bro <3

## createWebsocketApi

High level hook. Allows you create and manage websocket connection <br>
This hook returns you these statements:

1. `socket` - instance of ReconnectingWebSocket
2. `isReady` - socket state
3. `subscribe` - function for subscribe event (.addEventListener alternative, recommended for use)
4. `unsubscribe` - function for unsubscribe event (.removeEventListener alternative, recommended for use)
5. `disconnect` - function for disconnect from websocket channel (.close alternative, recommended for use)
6. `sendJson` - function for send json to channel (by default all messages are string)

### create hook

```ts
import { createWebsocketApi } from "react-websocket-api";

/**
 * @param url your websocket channel
 * @param options onReady, onClose, onError handlers
 *
 * */
export const useMainChannel = createWebsocketApi("wss://localhost:8080/ws", {
    onReady: (ev) => console.log(`[WebSocket] initialized`), // when websocket connect opened (onReady is a aliase for onOpen in original WebSocket class)
    onClose: (ev) => console.warn(`[WebSocket] closed with ${ev.code} code`), // when websocket connect closed
    onError: (ev) => console.error(ev), // when websocket returns error
});
```

### subsribe and unsubscribe

```ts
import { useMainChannel } from "./use-main-channel";
import { useEffect, useCallback } from "react";

export function MyComponent() {
    const { subscribe, unsubscribe } = useMainChannel();

    const handleMessage = useCallback((ev) => {
        console.log(ev.data); // string
    }, []); // always use callback for this functions! if not, you will debug why function work more than once for one event :)

    useEffect(() => {
        subscribe("message", handleMessage);

        return () => unsubscribe("message", handleMessage) // don't forget unsubcribe : )
    }, []);
}
```

## useWebsocketConnection (not recommended)

Low level hook. This hook allows you connect to websocket channel

### Usage

```ts
/**
 * @param url your websocket channel
 * @param options onReady, onClose, onError handlers
 *
 * */
useWebsocketConnection("wss://localhost:3000/ws", {
    onReady: (ev) => console.log(`[WebSocket] initialized`), // when websocket connect opened (onReady is a aliase for onOpen in original WebSocket class)
    onClose: (ev) => console.warn(`[WebSocket] closed with ${ev.code} code`), // when websocket connect closed
    onError: (ev) => console.error(ev), // when websocket returns error
});
```
