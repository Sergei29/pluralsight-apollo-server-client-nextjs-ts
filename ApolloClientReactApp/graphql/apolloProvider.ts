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
export const paginationDataVar = makeVar({
  offset: 0,
  limit: 3,
  currentPage: 0,
  totalItemCount: 0,
});

/**
 * @description custom hook
 * @returns {Object} Apollo Client instance
 */
export const useApollo = () => {
  const options: InMemoryCacheConfig = {
    typePolicies: {
      Query: {
        fields: {
          speakersConcat: {
            read: (existing) => existing,
            merge: (existing, incoming) => {
              return !existing
                ? {
                    __typename: incoming.__typename,
                    datalist: [...incoming.datalist],
                    pageInfo: { ...incoming.pageInfo },
                  }
                : {
                    __typename: incoming.__typename,
                    datalist: [...existing.datalist, ...incoming.datalist],
                    pageInfo: { ...incoming.pageInfo },
                  };
            },
            keyArgs: false,
          },
        },
      },
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
