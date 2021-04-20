import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const useApollo = () => {
  const options = {};
  return new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(options),
  });
};
