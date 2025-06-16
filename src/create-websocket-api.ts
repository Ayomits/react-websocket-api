import { WebSocketEventType } from './types';
import {
  useWebsocketConnection,
  WebsocketConnectionOptions,
} from './use-websocket';
import { useCallback } from 'react';

type SubscribeCallbackType<T = object> = (ev: MessageEvent<T>) => void;

export function createWebsocketApiHook(
  url: string,
  options: WebsocketConnectionOptions
) {
  return function useWebsocket() {
    const { socket, isReady } = useWebsocketConnection(url, options);

    const sendJson = useCallback(
      (json: object, retryLimit = 3, __retryDelay = 500, __retries = 0) => {
        if (isReady) {
          socket.current?.send?.(JSON.stringify(json));
        }
        if (__retries < retryLimit) {
          setTimeout(() => {
            sendJson(json, __retryDelay, __retries + 1);
          }, __retryDelay);
        }
      },
      [isReady, socket]
    );

    const subscribe = useCallback(
      <T>(
        eventType: WebSocketEventType,
        callback: SubscribeCallbackType<T>,
        retryLimit = 3,
        __retryDelay = 500,
        __retries = 0
      ) => {
        if (isReady) {
          socket.current?.addEventListener(
            eventType,
            callback as EventListener
          );
        }
        if (__retries < retryLimit) {
          setTimeout(() => {
            subscribe(
              eventType,
              callback,
              retryLimit,
              __retryDelay,
              __retries + 1
            );
          }, __retryDelay);
        }
      },
      [isReady, socket]
    );

    const unsubscribe = useCallback(
      (
        eventType: WebSocketEventType,
        callback: SubscribeCallbackType,
        retryLimit = 3,
        __retryDelay = 500,
        __retries = 0
      ) => {
        if (isReady) {
          socket.current?.removeEventListener(
            eventType,
            callback as EventListener
          );
        }
        if (__retries < retryLimit) {
          setTimeout(() => {
            subscribe(
              eventType,
              callback,
              retryLimit,
              __retryDelay,
              __retries + 1
            );
          }, __retryDelay);
        }
      },
      [isReady, socket]
    );

    const disconnect = useCallback(() => {
      if (!isReady) {
        return;
      }
      socket.current?.close();
    }, [isReady, socket]);

    return {
      socket,
      isReady,
      subscribe,
      unsubscribe,
      disconnect,
    };
  };
}
