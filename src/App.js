import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { getEvents, slugify, getCity } from './utils';
import Event from './Event';

export default function TicketmasterApp() {
  const [events, setEvents] = useState([]);
  // const [links, setLinks] = useState({});

  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [noResults, setNoResults] = useState(false);

  async function handleSearch(path = '') {
    setNoResults(false);
    const res = await getEvents({city, keyword, startDate});
    if (!res.events.length) {
      setNoResults(true);
    }

    // delete res.links["self"];
    // setLinks(res.links);
    setEvents(res.events);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <Box mb={2} sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Typography variant="h3" component="h1" mb={3} mt={2} align="center">Ticketmaster Event Search</Typography>

          <Routes>
            <Route path="/" element={<React.Fragment>
              <Box ml={2} sx={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <TextField mb={1} mr={1}
                  sx={{margin: "0 1em 1em 0"}}
                  id="keyword"
                  label="Keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <TextField
                  sx={{margin: "0 1em 1em 0"}}
                  id="city"
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(value) => setStartDate(value)}
                    renderInput={(params) => <TextField sx={{width: 195, margin: "0 1em 1em 0"}} {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Button onClick={handleSearch} variant="contained" sx={{marginBottom: "1em" }}>Search</Button>

              {noResults && <Alert severity="info">No events found</Alert>}
              {events.map((event, i) => {
                return (
                <Link to={`/${event.id}/${slugify(`${getCity(event)} ${event.name}`)}`} key={i}>
                  <Card sx={{display: 'inline-block'}} variant="outlined"><Event events={events} eventId={event.id}/></Card>
                </Link>
                )
              })}
            </React.Fragment>} />

            <Route path="/:id/:slug" element={
              <Card sx={{display: 'inline-block'}} variant="outlined"><Event events={events} detailView/></Card>}
            />
          </Routes>
        </Box>
      </Router>
    </React.Fragment>

  );
}
