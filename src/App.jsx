import React from 'react';
import MarketPage from './screens/market.jsx'; // Ensure the path is correct
import InfoPage from './screens/info.jsx';
import YieldPrediction from './screens/yield.jsx';
import SchemePage from './screens/scheme.jsx';

function App() {
  return(
    <>
      <MarketPage />
      <InfoPage />
      <YieldPrediction />
      <SchemePage />
    </>
  );
}

export default App;
