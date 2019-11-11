import * as express from 'express';
import {
  cntrler
} from '../controllers';

import { serviceFactory, properties } from '../services';
const evtBriteService = serviceFactory(properties.eventBriteToken);

const evtBriteCntrler = cntrler(evtBriteService);

export const router: express.Router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

router.get('/categories', evtBriteCntrler.getCategories);
router.route('/events')
  .get(evtBriteCntrler.getEvents)
  .post(evtBriteCntrler.saveEvent)
router.get('/events/saved', evtBriteCntrler.getSavedEvents);
router.delete('/events/:id', evtBriteCntrler.deleteEvent);
router.post('/event/search', evtBriteCntrler.getEvents)