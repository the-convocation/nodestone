import { Request, Response } from 'express';
import { FreeCompany } from '../service/freecompany/freecompany';
import { FCMembers } from '../service/freecompany/members';
import { FreeCompanySearch } from '../service/search/freecompany-search';
import { StatusCodes } from 'http-status-codes';

const freeCompanyParser = new FreeCompany();
const freeCompanyMemberParser = new FCMembers();
const freeCompanySearch = new FreeCompanySearch();

export async function search(req: Request, res: Response) {
  try {
    const parsed = await freeCompanySearch.parse(req);
    res.status(StatusCodes.OK).send(parsed);
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const freeCompany = await freeCompanyParser.parse(req);
    const parsed: any = {
      FreeCompany: {
        ID: +req.params.fcId,
        ...freeCompany,
      },
    };
    const additionalData = Array.isArray(req.query.data)
      ? req.query.data
      : [req.query.data].filter((d) => !!d);
    if (additionalData.includes('FCM')) {
      parsed.FreeCompanyMembers = await freeCompanyMemberParser.parse(req);
    }
    res.status(StatusCodes.OK).send(parsed);
  } catch (err: any) {
    if (err.message === StatusCodes.NOT_FOUND) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
}

module.exports = {
  search,
  get,
};
