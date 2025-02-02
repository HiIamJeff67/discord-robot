import { Request, Response } from 'express';
import { ValidateTokenDataInterface } from '../../interfaces';

export interface AppContextInterface {
  req: Request;
  res: Response;
  user?: ValidateTokenDataInterface;
}
