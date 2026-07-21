export interface Friend {
  id: string;
  name: string;
  pin: string;
  profilePhoto: string;
  customMessage: string;
  photoTemplate: string[];
  collagePhotos: string[];
  collageParagraph: string;
  showParagraph: boolean;
  theme?: string;
  birthdate?: string; // YYYY-MM-DD
  visits?: number;
  candleBlown?: number;
  pinPhoto?: string;
  introPhoto?: string;
  outroPhoto?: string;
  letterText?: string;
  letterPhotos?: string[];
  introLinePhoto?: string;
  introLine?: string;
  bgmUrl?: string;
  heroFont?: string;
}
