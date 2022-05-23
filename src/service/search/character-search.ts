import { PaginatedPageParser } from '../core/paginated-page-parser';
import { CssSelectorRegistry } from '../core/css-selector-registry';
import * as characterSearch from '../../lib/lodestone-css-selectors/search/character.json';
import { Request } from 'express';

export class CharacterSearch extends PaginatedPageParser {
  protected getBaseURL(req: Request): string {
    console.log(req.query);
    let query = `?q=${req.query.name}`;
    if (req.query.dc) {
      query += `&worldname=_dc_${req.query.dc}`;
    } else if (req.query.server) {
      query += `&worldname=${req.query.server}`;
    }
    return `https://na.finalfantasyxiv.com/lodestone/character/${query}`;
  }

  protected getCSSSelectors(): CssSelectorRegistry {
    return characterSearch;
  }
}
