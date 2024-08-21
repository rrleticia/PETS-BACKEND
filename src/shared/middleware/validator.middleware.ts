import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Validators } from '../../models';
import { HttpError } from '../errors';

export const validatorMiddleware = (validator: 'OwnerModel') => {
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const value = await Validators[validator].validateAsync(request.body, {
        warnings: true,
      });
      request.body = value;
      next();
    } catch (error: any) {
      next(new HttpError(error.message, 422));
    }
  };
};
