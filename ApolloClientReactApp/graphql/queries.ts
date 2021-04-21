import { gql } from "@apollo/client";

export const GET_SPEAKERS = gql`
  query Speakers {
    speakers {
      datalist {
        id
        first
        last
        favourite
        fullName @client
      }
    }
  }
`;
