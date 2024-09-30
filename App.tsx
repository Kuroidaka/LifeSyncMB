import React, { useEffect } from 'react';
import Providers from './src/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export default function App() {

  useEffect(() => {
    if (typeof HermesInternal !== 'undefined') {
      console.log('Running Hermes');
    } else {
      console.log('Not Running Hermes');
    }
  }, []);
  return <QueryClientProvider client={queryClient}>
    <Providers />
  </QueryClientProvider>;
}