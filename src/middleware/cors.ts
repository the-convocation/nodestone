import { Request, Response, NextFunction } from 'express';

function cors(req: Request, res: Response, next: NextFunction) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  next();
}

export default cors;
