import express from "express";
import { Character } from "./service/profile/character";
import { Achievements } from "./service/profile/achievements";
import { ClassJob } from "./service/profile/classjob";
import { FreeCompany } from "./service/freecompany/freecompany";
import { FCMembers } from "./service/freecompany/members";
import { CharacterSearch } from "./service/search/character-search";
import { FreeCompanySearch } from "./service/search/freecompany-search";

const app = express();

const characterParser = new Character();
const achievementsParser = new Achievements();
const classJobParser = new ClassJob();
const freeCompanyParser = new FreeCompany();
const freeCompanyMemberParser = new FCMembers();
const characterSearch = new CharacterSearch();
const freecompanySearch = new FreeCompanySearch();

export default function () {

  app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    else {
      next();
    }
  });

  app.get("/Character/Search", async (req, res) => {
    try {
      const parsed = await characterSearch.parse(req);
      return res.status(200).send(parsed);
    } catch (err: any) {
      return res.status(500).send(err);
    }
  });

  app.get("/FreeCompany/Search", async (req, res) => {
    try {
      const parsed = await freecompanySearch.parse(req);
      return res.status(200).send(parsed);
    } catch (err: any) {
      return res.status(500).send(err);
    }
  });

  app.get("/Character/:characterId", async (req, res) => {
    if ((req.query["columns"] as string)?.indexOf("Bio") > -1) {
      res.set("Cache-Control", "max-age=3600");
    }
    try {
      const character = await characterParser.parse(req, "Character.");
      const parsed: any = {
        Character: {
          ID: +req.params.characterId,
          ...character,
        },
      };
      const additionalData = Array.isArray(req.query.data)
          ? req.query.data
          : [req.query.data].filter((d) => !!d);
      if (additionalData.includes("AC")) {
        parsed.Achievements = await achievementsParser.parse(
            req,
            "Achievements."
        );
      }
      if (additionalData.includes("CJ")) {
        parsed.ClassJobs = await classJobParser.parse(req, "ClassJobs.");
      }
      return res.status(200).send(parsed);
    } catch (err: any) {
      if (err.message === "404") {
        return res.sendStatus(404);
      }
      return res.status(500).send(err);
    }
  });

  app.get("/FreeCompany/:fcId", async (req, res) => {
    try {
      const freeCompany = await freeCompanyParser.parse(req, "FreeCompany.");
      const parsed: any = {
        FreeCompany: {
          ID: +req.params.fcId,
          ...freeCompany,
        },
      };
      const additionalData = Array.isArray(req.query.data)
          ? req.query.data
          : [req.query.data].filter((d) => !!d);
      if (additionalData.includes("FCM")) {
        parsed.FreeCompanyMembers = await freeCompanyMemberParser.parse(
            req,
            "FreeCompanyMembers."
        );
      }
      return res.status(200).send(parsed);
    } catch (err: any) {
      if (err.message === "404") {
        return res.sendStatus(404);
      }
      return res.status(500).send(err);
    }
  });

  return app;
}