import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import TaxiCashDapp from './components/TaxiCashDapp.js';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <h1>TaxiCash Dapp</h1>
        </header>
        <main>
          <TaxiCashDapp />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;