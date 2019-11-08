import { Request, Response } from 'express';
import * as Promise from 'bluebird';
import {
  properties,
  logger
} from '../services';
import * as postgres from 'pg-promise';
const {
  postgres: { url, user, pass }
} = properties;
const pg = postgres({})
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'evtbrite',
  user,
  password: pass
};
const db = pg(cn);

export const controller = (evtBriteService: any) => {
  let cntrler: any = {
    getCategories(req: Request, res: Response) {
      evtBriteService.getCategories().then((categories: any) => {
        res.status(200).send(categories);
      })
    },
    getEvents(req: Request, res: Response) {
      evtBriteService.getEvents().then((events: any) =>
        res.status(200).send(events)
      )
    },
    getSavedEvents(req: Request, res: Response) {
      db.query('SELECT * FROM Event').then(resp => {
        console.log(resp);
        res.status(200).send(resp)
      });
    },
    saveEvent(req: Request, res: Response) {
      console.log(req.body);
      const {
        id, name, start, end, timezone, description,
        logoId, logoUrl, categoryId, subcategoryId, venueAddress
      } = req.body;
      db.connect().then(() => {
        db.none(
          'INSERT INTO event VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
          [
            parseInt(id, 10), name, start, end, timezone, description,
            parseInt(logoId, 10), logoUrl,
            parseInt(categoryId, 10),
            subcategoryId ? parseInt(subcategoryId, 10): 0,
            venueAddress
          ]
        ).then(() => res.status(201).send({})).catch(console.log)
      })
    },
    deleteEvent(req: Request, res: Response) {
      console.log(req)
      db.none(`DELETE FROM event WHERE id=${req.params.id}`).then(() => {
        res.status(201).send({});
      })
    }
  };

  return cntrler;
};
