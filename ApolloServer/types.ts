export type SpeakerType = {
  id: string;
  first: string;
  last: string;
  favorite: boolean;
  cursor?: string;
};

export type PageInfoType = {
  totalItemCount: number;
  lastCursor?: string;
  hasNextPage?: boolean;
};
