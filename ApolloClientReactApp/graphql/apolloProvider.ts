import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  InMemoryCacheConfig,
} from "@apollo/client";

/**
 * @description reactive variables
 */
export const currentThemeVar = makeVar("light");
export const checkBoxListVar = makeVar([]);

/**
 * @description custom hook
 * @returns {Object} Apollo Client instance
 */
export const useApollo = () => {
  const options: InMemoryCacheConfig = {
    typePolicies: {
      Speaker: {
        fields: {
          fullName: {
            read: (_, { readField }) =>
              `${readField("first")} ${readField("last")}`,
          },
          checkBoxColumn: {
            read: (_, { readField }) => {
              const strId = readField("id");
              const arrSelectedSpeakersIds = checkBoxListVar();
              return arrSelectedSpeakersIds.includes(strId);
            },
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
