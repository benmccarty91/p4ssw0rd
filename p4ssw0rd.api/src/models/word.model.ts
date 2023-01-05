export class WordPool {
  category: string;
  words: string[];
}

export type SpentWords = {
  [category: string]: string[];
};
