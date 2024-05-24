export interface ServerToClientEvents {
  message: (message: Message) => void;
}

export interface ClientToServerEvents {
  setName: (name: string) => void;
  message: (message: Message) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
}

export interface Message {
  replyMessage: any;
  name?: string;
  type: "text" | "image";
  content: string;
  replyTo?: Message;
}
