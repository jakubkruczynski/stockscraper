import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';  // import Card components
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';  // import Icons
import LinkIcon from '@mui/icons-material/Link';
import './App.css';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';  // New import
import LaunchIcon from '@mui/icons-material/Launch';  // New import
import TrendingUpIcon from '@mui/icons-material/TrendingUp';  // New import
import CircularProgress from '@mui/material/CircularProgress';

const width = window.innerWidth;

function App() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (inputValue) {
      axios.get(`https://jakub94.pythonanywhere.com/suggest?partial_name=${inputValue}`)
        .then((response) => {
          setSuggestions(Object.entries(response.data.matched_companies));
        })
        .catch((error) => console.error("Error fetching suggestions:", error));
    }
  }, [inputValue]);

    const fetchStockInfo = async (ticker) => {
      try {
        setIsLoading(true);  // Set loading to true before fetching data
        const response = await axios.get(`https://jakub94.pythonanywhere.com/stocks?tickers=${ticker}`);
        setStockInfo(response.data);
      } catch (error) {
        console.error("Error fetching stock info:", error);
      } finally {
        setIsLoading(false);  // Set loading to false after fetching data or if an error occurs
      }
    };

  return (
    <div className="App" style={{ backgroundColor: '#ffffff' }}>  {/* Change background color to white */}
      <Container maxWidth="md">
        <header className="App-header">
          <Typography variant="h2" gutterBottom style={{ color: '#3f51b5', marginBottom: '20px', fontWeight: 'bold' }}>  {/* Bolder text */}
            Stock Price Lookup
          </Typography>
          <Autocomplete
            id="search-box"
            options={suggestions}
            getOptionLabel={(option) => option[0]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type company name or ticker..."
                variant="outlined"
                style={{
                  backgroundColor: '#F5F5F5',  // Lighter gray
                  width: width > 768 ? '500px' : width > 576 ? '400px' : '300px',
                  marginBottom: '20px'
                }}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}

            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedCompany({name: newValue[0], ticker: newValue[1]});
                fetchStockInfo(newValue[1]);
              }
            }}
          />
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <CircularProgress />
              </div>
            )}

          {stockInfo && selectedCompany && (
            <Card style={{ maxWidth: 400, margin: '20px auto', backgroundColor: '#F0F4F8' }}>  {/* Lighter background */}
              <CardContent>
                <div style={{ marginBottom: '10px' }}>
                  <Typography variant="h5" component="div" style={{ color: '#3f51b5' }}>
                    Stock Information for:
                  </Typography>
                    <Typography variant="h5" component="div" style={{ color: '#3f51b5', fontWeight: 'bold', fontSize: '24px' }}>
                      {selectedCompany.name}
                    </Typography>

                </div>



                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <LocalOfferIcon fontSize="small" style={{ color: '#4caf50' }} /> {/* New icon and color */}
                      Ticker: {selectedCompany.ticker}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <MonetizationOnIcon fontSize="small" style={{ color: '#fbc02d' }} /> {/* New color */}
                      Stock Price: ${stockInfo[selectedCompany.ticker]}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <LaunchIcon fontSize="small" style={{ color: '#1976d2' }} /> {/* New icon and color */}
                      <a href={`https://finance.yahoo.com/quote/${selectedCompany.ticker}`} target="_blank" rel="noopener noreferrer">
                        Yahoo Finance
                      </a>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          )}
        </header>
      </Container>
    </div>
  );
}

export default App;
