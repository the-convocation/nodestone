import { Request, Response, NextFunction } from 'express';

module.exports = function (req: Request, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    else {
        next();
    }
}
