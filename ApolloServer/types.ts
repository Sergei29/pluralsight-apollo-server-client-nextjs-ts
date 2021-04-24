export type SpeakerType = {
  id: string;
  first: string;
  last: string;
  favourite: boolean;
  cursor?: string;
};

export type PageInfoType = {
  totalItemCount: number;
  lastCursor?: string;
  hasNextPage?: boolean;
};
