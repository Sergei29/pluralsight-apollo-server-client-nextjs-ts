export type SpeakerType = {
  id: string;
  first: string;
  last: string;
  favourite: boolean;
  fullName?: string;
  checkBoxColumn?: boolean;
};

export type NewSpeakerType = {
  first: string;
  last: string;
  favourite: null | boolean;
};
