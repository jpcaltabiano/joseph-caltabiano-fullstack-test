import { StoreProvider } from 'easy-peasy';
import { store } from './store';
import React from "react";
import BlastTest from "./BlastTest";
import Results from './Results'

function App() {
  return (
    <StoreProvider store={store}>
      <BlastTest />
      <Results />
    </StoreProvider>
  );
}

export default App