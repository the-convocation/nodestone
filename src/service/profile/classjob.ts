import { Request } from 'express';
import { CssSelectorRegistry } from '../core/css-selector-registry';
import * as classJob from '../../lib/lodestone-css-selectors/profile/classjob.json';
import { PaginatedPageParser } from '../core/paginated-page-parser';

export class ClassJob extends PaginatedPageParser {
  protected getCSSSelectors(): CssSelectorRegistry {
    return classJob;
  }

  protected getBaseURL(req: Request): string {
    return (
      'https://na.finalfantasyxiv.com/lodestone/character/' +
      req.params.characterId +
      '/class_job'
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async parse(req: Request): Promise<Object> {
    const fromSuper: any = await super.parse(req);
    delete fromSuper.Pagination;
    return fromSuper;
  }
}
