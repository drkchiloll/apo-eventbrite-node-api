import { Request, Response } from 'express';
import * as Promise from 'bluebird';
import {
  properties,
  logger
} from '../services';

export const controller = (evtBriteService: any) => {
  let cntrler: any = {
    getCategories(req: Request, res: Response) {
      evtBriteService.getCategories().then((categories: any) => {
        res.status(200).send(categories);
      })
    },
    getEvents(req: Request, res: Response) {
      const { text }= req.body;
      evtBriteService.getEvents(text).then((events: any) =>
        res.status(200).send(events)
      )
    },
    getSavedEvents(req: Request, res: Response) {
      evtBriteService.getSaved().then((events: any) => {
        res.status(200).send({ events });
      })
    },
    saveEvent(req: Request, res: Response) {
      evtBriteService.save(req.body).then(() => {
        res.status(201).send({})
      })
    },
    deleteEvent(req: Request, res: Response) {
      evtBriteService.delete(req.params.id).then(() => {
        res.status(201).send({});
      })
    }
  };

  return cntrler;
};
