import { PageParser } from './page-parser';
import { Request } from 'express';

export abstract class PaginatedPageParser extends PageParser {
  protected abstract getBaseURL(req: Request): string;

  protected getURL(req: Request): string {
    let query = '';
    if (req.query && req.query.page) {
      query = `?page=${req.query?.page}`;
    }
    return `${this.getBaseURL(req)}${query}`;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async parse(req: Request): Promise<Object> {
    const baseParse: any = await super.parse(req);
    delete baseParse.ListNextButton;
    baseParse.Pagination = {
      Page: +baseParse.CurrentPage,
      PageTotal: +baseParse.NumPages,
      PageNext:
        +baseParse.CurrentPage < +baseParse.NumPages
          ? +baseParse.CurrentPage + 1
          : null,
      PagePrev: +baseParse.CurrentPage < 1 ? null : +baseParse.CurrentPage - 1,
    };
    delete baseParse.CurrentPage;
    delete baseParse.NumPages;
    return baseParse;
  }
}
