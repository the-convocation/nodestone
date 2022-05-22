import { Request, Response } from 'express';
import { CharacterSearch } from "../service/search/character-search";
import {Character} from "../service/profile/character";
import {Achievements} from "../service/profile/achievements";
import {ClassJob} from "../service/profile/classjob";
import {FreeCompany} from "../service/freecompany/freecompany";
import {FCMembers} from "../service/freecompany/members";
import {FreeCompanySearch} from "../service/search/freecompany-search";

const freeCompanyParser = new FreeCompany();
const freeCompanyMemberParser = new FCMembers();
const freeCompanySearch = new FreeCompanySearch();

async function search(req: Request, res: Response) {
    try {
        const parsed = await freeCompanySearch.parse(req);
        res.status(200).send(parsed);
    } catch (err: any) {
        res.status(500).send(err);
    }
}

async function get(req: Request, res: Response) {
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
        res.status(200).send(parsed);
    } catch (err: any) {
        if (err.message === "404") {
            res.sendStatus(404);
        }
        res.status(500).send(err);
    }
}

module.exports = {
    search,
    get
}