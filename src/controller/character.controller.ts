import { Request, Response } from 'express';
import { CharacterSearch } from '../service/search/character-search';
import { Character } from '../service/profile/character';
import { Achievements } from '../service/profile/achievements';
import { ClassJob } from '../service/profile/classjob';

const characterSearch = new CharacterSearch();
const characterParser = new Character();
const achievementsParser = new Achievements();
const classJobParser = new ClassJob();

export async function search(req: Request, res: Response) {
  try {
    const parsed = await characterSearch.parse(req);
    res.status(200).send(parsed);
  } catch (err: any) {
    res.status(500).send(err);
  }
}

export async function get(req: Request, res: Response) {
  if ((req.query['columns'] as string)?.indexOf('Bio') > -1) {
    res.set('Cache-Control', 'max-age=3600');
  }
  try {
    const character = await characterParser.parse(req, 'Character.');
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
      parsed.Achievements = await achievementsParser.parse(
        req,
        'Achievements.',
      );
    }
    if (additionalData.includes('CJ')) {
      parsed.ClassJobs = await classJobParser.parse(req, 'ClassJobs.');
    }
    res.status(200).send(parsed);
  } catch (err: any) {
    if (err.message === '404') {
      res.sendStatus(404);
    }
    res.status(500).send(err);
  }
}

module.exports = {
  search,
  get,
};
