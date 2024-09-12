import React, { useEffect } from 'react';
import Providers from './src/navigation';

export default function App() {

  useEffect(() => {
    if (typeof HermesInternal !== 'undefined') {
      console.log('Running Hermes');
    } else {
      console.log('Not Running Hermes');
    }
  }, []);
  return <Providers />;
}