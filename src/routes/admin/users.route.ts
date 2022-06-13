import { createUserHandler } from '../../controllers/user.controller';
import { Router } from 'express';

// Middleware

// Schemas

// Controller
import { flushExpiredTokenHandler } from '../../controllers/auth.controller';

let route = Router();

route.post('/', createUserHandler);
route.delete('/session-flush', flushExpiredTokenHandler);

export default route;
