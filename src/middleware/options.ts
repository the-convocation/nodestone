import { Request, Response, NextFunction } from 'express';

function options(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    next();
  }
}

export default options;
