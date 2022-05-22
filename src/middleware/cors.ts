import { Request, Response, NextFunction } from 'express';

module.exports = function (req: Request, res: Response, next: NextFunction) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next()
}
