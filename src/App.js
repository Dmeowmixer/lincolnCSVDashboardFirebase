import React from 'react';
import './App.css';
import Parser from './Components/Parser';
import { Jumbotron } from 'reactstrap';
// import RenderStoredCSV from './Components/RenderStoredCSV';

function App() {
  return (
    <div className="App">
      <Jumbotron>
        <h1>CSV Dash</h1>
        <h2>To upload, hit import and select the target CSV file from the popup window</h2>
        <h2>To toggle the filter anonymous donations, hit the filter button.</h2>
      </Jumbotron>
      <Parser />
     </div>
  );
}

export default App;