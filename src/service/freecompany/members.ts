import { Request } from 'express';
import { CssSelectorRegistry } from '../core/css-selector-registry';
import * as members from '../../lib/lodestone-css-selectors/freecompany/members.json';
import { PaginatedPageParser } from '../core/paginated-page-parser';

export class FCMembers extends PaginatedPageParser {
  protected getCSSSelectors(): CssSelectorRegistry {
    return members;
  }

  protected getBaseURL(req: Request): string {
    return (
      'https://na.finalfantasyxiv.com/lodestone/freecompany/' +
      req.params.fcId +
      '/member'
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async parse(req: Request): Promise<Object> {
    return await super.parse(req);
  }
}
