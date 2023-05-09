import './App.css';
import data from './mac-arena-2023-05-10.json';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import moment from 'moment';

function App() {


  return (
    <>
      <AutoGrid />
    </>
  );
}

export default App

function AutoGrid() {
  return (
    <Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {data.map((e) => {
          // only create grids for the available slots
          return e.is_available ? <Grid xs={3}>
            <BasicCard  {...e} />
          </Grid> : null;
        })}
      </Grid>
    </Box>
  );
}

function BasicCard({
  source_website,
  court,
  time_slot_start,
  time_slot_end,
  is_available,
}) {
  const displayFormat = "DD MMM HH:MM"
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {court}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {moment(time_slot_start).format(displayFormat)} to {moment(time_slot_end).format(displayFormat)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={source_website}>Go to website</Button>
      </CardActions>
    </Card>
  );
}