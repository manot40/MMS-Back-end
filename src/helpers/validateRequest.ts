import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import msg from './messenger';

const validate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (e) {
    return res.status(400).send(msg(400, {}, e.message));
  }
};

export default validate;
