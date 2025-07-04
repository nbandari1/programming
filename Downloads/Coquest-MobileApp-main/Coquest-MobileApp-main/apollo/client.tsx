// graphql/client.js
import { ApolloClient, InMemoryCache, ApolloProvider as Provider, createHttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: createHttpLink({
        uri: 'http://localhost:4000/graphql', 
      }),
      cache: new InMemoryCache(),
});

import { ReactNode } from 'react';

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return <Provider client={client}>{children}</Provider>;
};