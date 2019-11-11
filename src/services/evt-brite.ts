import eventbrite from 'eventbrite';
import * as promise from 'bluebird';
import { Event } from '../models/evt-brite';
import * as qs from 'querystring';
import { properties as props } from '../services';
import * as postgres from 'pg-promise';
import pg = require('pg-promise/typescript/pg-subset');

export const serviceFactory = (token: string) => {
	const sdk = eventbrite({ token })
	const {
		postgres: { user, pass },
	} = props;
	const cn: any = {
		host: 'localhost',
		port: 5432,
		database: 'evtbrite',
		user,
		password: pass
	};
	const pg = postgres({});
	const service = {
		db: pg(cn),
		getCategories() {
			return sdk.request('/categories')
		},
		getEvents(text: any) {
			const uri = '/events/search?',
				params: any = {
					'location.address': 'austin',
					'location.within': '15km',
					'expand': 'venue',
					'sort_by': 'date'
				};
			if(text) {
				params['q'] = encodeURI(text);
			}
			let querystring = qs.stringify(params);
			return sdk.request(uri + querystring).then(({ events }: any) => {
				return promise.map(events, (event: any): Event => {
					return {
						name: event.name.text,
						description: event.description.text,
						id: parseInt(event.id, 10),
						start: event.start.local,
						end: event.end.local,
						timezone: event.start.timezone,
						logoId: event.logo_id ? parseInt(event.logo_id, 10): 0,
						logoUrl: event.logo ? event.logo.url : 'none',
						venueAddress: event.venue.address.localized_address_display,
						categoryId: event.category_id ? parseInt(event.category_id, 10): 0,
						subcategoryId: event.subcategory_id ? parseInt(event.subcategory_id, 10): 0,
						favorite: false
					}
				}).then(events => ({ events }))
			}).catch(console.log)
		},
		getSaved() {
			return this.db.query(
				'SELECT * FROM Event'
			).then((events: any) => {
				if(events.length > 0) {
					return promise.map(events, (event: any) => {
						return {
							name: event.name,
							start: event.start,
							end: event.end,
							id: event.id,
							timezone: event.timezone,
							logoId: event.logo_id,
							logoUrl: event.logo_url,
							categoryId: event.category_id,
							venueAddress: event.venue_address,
							subcategoryId: event.subcategory_id,
							favorite: true
						}
					})
				} else {
					return 0;
				}
			})
		},
		getOne(id: string) {
			return this.db.query(
				`SELECT * FROM event WHERE id=${id}`
			)
		},
		save(event: any) {
			const {
				id, name, start, end, timezone, description,
				logoId, logoUrl, categoryId, subcategoryId,
				venueAddress
			} = event;
			return this.db.none(
				'INSERT INTO event VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11',
				[
					id, name, start, end, timezone, description,
					logoId, logoUrl, categoryId, subcategoryId,
					venueAddress
				]
			)
		},
		delete(id: string) {
			return this.db.none(`DELETE FROM event WHERE id=${id}`);
		}
	};
	return service;
}