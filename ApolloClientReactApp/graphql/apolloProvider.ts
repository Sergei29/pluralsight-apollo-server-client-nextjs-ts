import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  InMemoryCacheConfig,
} from "@apollo/client";

export const currentThemeVar = makeVar("light");
export const useApollo = () => {
  const options: InMemoryCacheConfig = {
    typePolicies: {
      Speaker: {
        fields: {
          fullName: {
            read: (_, { readField }) =>
              `${readField("first")} ${readField("last")}`,
          },
        },
      },
    },
  };
  return new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(options),
  });
};
