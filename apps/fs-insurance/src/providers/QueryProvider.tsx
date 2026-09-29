'use client';

import { FC, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IQueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: FC<IQueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
