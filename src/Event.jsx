import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Launch from '@mui/icons-material/Launch';
import Typography from '@mui/material/Typography';

import { getTicketmasterImage, getCity, getEvent } from './utils';

export default function Event({ events, eventId, detailView = false }) {
  let params = useParams();
  let navigate = useNavigate();

  let event = getEvent(events, detailView ? params.id : eventId);

  useEffect(() => {
    if (!event) {
      navigate('/');
    }
  }, [event, navigate])

  return (event &&
        <Box sx={{display: 'inline-block', maxWidth: 640}}>

          <CardHeader title={event.name} subheader={`${getCity(event)}, ${event.dates.start.localDate}`}/>
          <CardMedia
            component="img"
            height="360"
            image={getTicketmasterImage(event.images, "16_9", 360)}
            alt={event.name}
          />

          {detailView && <>
            <CardContent>
              <Typography variant="body1" mr={1}>Venue: {event._embedded.venues[0].name}</Typography>
              <Typography variant="body1" mr={1}>{`Lineup: ${event._embedded.attractions.map((attraction) => {
                return attraction.name}).join(' • ')}`}
              </Typography>
            </CardContent>
            
            <CardActions m={2} sx={{display: "flex", justifyContent: "space-between", padding: "0 1em 1em"}}>
              <Button variant="outlined" onClick={() => navigate('/')}>Return to results</Button>
              <Button variant="contained" href={event.url} target="_blank" startIcon={<Launch />}>Shop for tickets</Button>
            </CardActions>
          </>}

      </Box>);
}