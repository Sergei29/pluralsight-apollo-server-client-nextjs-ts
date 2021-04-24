export type SpeakerType = {
  id: string;
  first: string;
  last: string;
  favorite: boolean;
  fullName?: string;
  checkBoxColumn?: boolean;
};

export type NewSpeakerType = {
  first: string;
  last: string;
  favorite: null | boolean;
};
