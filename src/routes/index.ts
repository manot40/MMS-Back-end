import { Router } from 'express';
import { requireAuth } from '../middleware';

// Routes
import Default from './public.route';
import Install from './install.route';
import Auth from './auth.route';
import Transaction from './transaction.route';
import User from './user.route';
import Item from './item.route';
import Warehouse from './warehouse.route';
import AdminUsers from './admin/users.route';
import AdminItem from './admin/item.route';
import AdminWarehouse from './admin/warehouse.route';
import AdminTransaction from './admin/transaction.route';

const router = Router();

router.use('/', Default);
router.use('/install', Install);

// Standard user route
router.use('/auth', Auth);
router.use('/user', requireAuth(), User);
router.use('/item', requireAuth(), Item);
router.use('/warehouse', requireAuth(), Warehouse);
router.use('/transaction', requireAuth(), Transaction);

// Administrator route
router.use('/admin/users', requireAuth('asAdmin'), AdminUsers);
router.use('/admin/item', requireAuth('asAdmin'), AdminItem);
router.use('/admin/warehouse', requireAuth('asAdmin'), AdminWarehouse);
router.use('/admin/transaction', requireAuth('asAdmin'), AdminTransaction);

export default router;
