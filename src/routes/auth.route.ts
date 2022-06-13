import { Router } from 'express';

// Helpers
import validateRequest from '../helpers/validateRequest';

// Schemas
import { createUserSessionSchema } from '../schemas/session.schema';

// Controllers
import { createUserSessionHandler, getUserSessionHandler, invalidateUserSessionHandler, refreshAccessToken } from '../controllers/auth.controller';

let route = Router();

route.post('/login', validateRequest(createUserSessionSchema), createUserSessionHandler);
route.post('/refresh', refreshAccessToken);
route.get('/session', getUserSessionHandler);
route.delete('/logout', invalidateUserSessionHandler);

export default route;
