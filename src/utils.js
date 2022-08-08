import axios from "axios";
import formatISO from 'date-fns/formatISO'

const TM_KEY = process.env.TM_KEY;

export async function getEvents(args) {
  const response = await axios.get(encodeURI(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TM_KEY}${
    args.path?.href?.split('?')?.length > 0 ? `&${args.path.href.split('?')[1]}` : ''
  }${
    !!args.keyword ? `&keyword=${args.keyword}` : ''
  }${
    !!args.city ? `&city=${args.city}` : ''
  }${
    !!args.startDate ? `&startDateTime=${formatISO(args.startDate)}` : ''
  }`));

  if (response.status !== 200 || !response.data._embedded) {
    return {events: [], links: {}};
  }

  return {events: response.data._embedded.events, links: response.data._links}
}

export function getTicketmasterImage(images, ratio, height) {
  return images.find((image) => {
    return image.ratio === ratio && image.height === height;
  }).url;
}

export function getCity(event) {
  return event._embedded.venues[0].city.name;
}

export function getEvent(events, eventId) {
  return events.find((event) => event.id === eventId);
} 

// https://www.30secondsofcode.org/js/s/slugify
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}