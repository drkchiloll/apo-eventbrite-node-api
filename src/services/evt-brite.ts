import eventbrite from 'eventbrite';
import * as promise from 'bluebird';
import { Event } from '../models/evt-brite';

export const serviceFactory = (token: string) => {
	const sdk = eventbrite({ token })
	const service = {
		getCategories() {
			return sdk.request('/categories')
		},
		getEvents(categories: string[]) {
			const uri = '/events/search',
				params = '?location.address=austin&location.within=10km&expand=venue';
			return sdk.request(uri + params).then(({ pagination, events }: any) => {
				return promise.map(events, (event: any): Event => {
					return {
						name: event.name.text,
						description: event.description.text,
						id: event.id,
						start: event.start.local,
						end: event.end.local,
						timezone: event.start.timezone,
						logoId: event.logo_id,
						logoUrl: event.logo ? event.logo.url : 'none',
						venueAddress: event.venue.address.localized_address_display,
						categoryId: event.category_id,
						subcategoryId: event.subcategory_id,
						favorite: false
					}
				})
			}).catch(console.log)
		}
	};
	return service;
}