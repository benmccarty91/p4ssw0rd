import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import { from, map, Observable } from "rxjs";
import { WordPool } from "src/models/word.model";
import { WordPoolRepository } from "src/repositories/wordPool.repository";

@Injectable({ scope: Scope.DEFAULT })
export class WordPoolService {
  constructor(private wordPoolRepo: WordPoolRepository) {}

  public getCategories(): Observable<string[]> {
    return from(this.wordPoolRepo.getCategories()).pipe(
      map((r) => {
        if (!r) {
          throw new InternalServerErrorException("could not fetch categories");
        }
        return r;
      })
    );
  }

  public getWordPool(
    category: string,
    spentWords?: string[]
  ): Observable<WordPool> {
    return from(this.wordPoolRepo.getWordPool(category)).pipe(
      map((r) => {
        if (!r) {
          throw new InternalServerErrorException("could not get word pool");
        }
        if (!spentWords || spentWords.length === 0) {
          return r;
        }
        r.words = r.words.filter((w) => !spentWords.includes(w)); //TODO: test this
        return r;
      })
    );
  }
}
