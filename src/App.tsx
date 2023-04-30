import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game';
import Landing from './components/Landing';
import GlobalStyle from "./styles/global";

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/play/:id" element={<Game />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;