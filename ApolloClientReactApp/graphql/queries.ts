import { gql } from "@apollo/client";

export const GET_SPEAKERS = gql`
  query Speakers($offset: Int = 0, $limit: Int = -1) {
    speakers(offset: $offset, limit: $limit) {
      datalist {
        id
        first
        last
        favorite
        fullName @client
        checkBoxColumn @client
      }
      pageInfo {
        totalItemCount
      }
    }
  }
`;

export const GET_SPEAKERS_CONCAT = gql`
  query SpeakersConcat($limit: Int = 0, $afterCursor: String = "") {
    speakersConcat(limit: $limit, afterCursor: $afterCursor) {
      datalist {
        id
        first
        last
        favorite
        cursor
      }
      pageInfo {
        totalItemCount
        lastCursor
        hasNextPage
      }
    }
  }
`;
