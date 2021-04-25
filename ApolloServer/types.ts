export type SessionSpeakerType = {
  sessionId: number;
  speakerId: number;
  eventYear: string;
};

export type SessionType = {
  id: string;
  title: string;
  eventYear?: string;
  cursor?: string;
};

export type SpeakerType = {
  id: string;
  first?: string;
  last?: string;
  favorite?: boolean;
  cursor?: string;
  sessions?: SessionType[];
};

export type PageInfoType = {
  totalItemCount: number;
  lastCursor?: string;
  hasNextPage?: boolean;
};
