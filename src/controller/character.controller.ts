import { Request, Response } from 'express';
import { CharacterSearch } from '../service/search/character-search';
import { Character } from '../service/profile/character';
import { Achievements } from '../service/profile/achievements';
import { ClassJob } from '../service/profile/classjob';
import { StatusCodes } from 'http-status-codes';

const characterSearch = new CharacterSearch();
const characterParser = new Character();
const achievementsParser = new Achievements();
const classJobParser = new ClassJob();

export async function search(req: Request, res: Response) {
  try {
    const parsed = await characterSearch.parse(req);
    res.status(StatusCodes.OK).send(parsed);
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const character = await characterParser.parse(req);
    const parsed: any = {
      Character: {
        ID: +req.params.characterId,
        ...character,
      },
    };
    const additionalData = Array.isArray(req.query.data)
      ? req.query.data
      : [req.query.data].filter((d) => !!d);
    if (additionalData.includes('AC')) {
      parsed.Achievements = await achievementsParser.parse(req);
    }
    if (additionalData.includes('CJ')) {
      parsed.ClassJobs = await classJobParser.parse(req);
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
