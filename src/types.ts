export type SubscribeCallbackType<T = object> = (ev: MessageEvent<T>) => void;

type LiteralEnum<T> = T[keyof T];

export const WebSocketEventType = {
  Message: 'message',
  Error: 'error',
  Open: 'open',
  Close: 'close',
} as const;

export type WebSocketEventType = LiteralEnum<typeof WebSocketEventType>;
