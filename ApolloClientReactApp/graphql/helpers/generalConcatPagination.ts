import { FieldReadFunction, FieldPolicy } from "@apollo/client";

type ReturnType = FieldReadFunction<any, any> | FieldPolicy<any, any, any>;

export const generalConcatPagination = (): ReturnType => ({
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
});
