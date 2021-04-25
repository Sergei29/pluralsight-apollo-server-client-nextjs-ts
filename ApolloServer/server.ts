import { gql, ApolloServer, UserInputError, IResolvers } from "apollo-server";
import axios from "axios";
import {
  SpeakerType,
  PageInfoType,
  SessionType,
  SessionSpeakerType,
} from "./types";

const DB_URI = "http://localhost:5000";

const getCursor = (mixValue: String | Number) =>
  Buffer.from(mixValue.toString()).toString("base64");

const getOffsetCustom = (arrData: SpeakerType[], afterCursor: string) => {
  const offsetBasedOnFind = arrData.findIndex(
    (objSpeaker) => getCursor(objSpeaker.id) === afterCursor
  );
  return offsetBasedOnFind === -1 ? 0 : offsetBasedOnFind + 1;
};

const typeDefs = gql`
  type Speaker {
    id: ID!
    first: String
    last: String
    favorite: Boolean
    cursor: String
    sessions: [Session]
  }

  input SpeakerInput {
    first: String
    last: String
    favorite: Boolean
  }

  type PageInfo {
    totalItemCount: Int
    lastCursor: String
    hasNextPage: Boolean
  }

  type SpeakerResults {
    datalist: [Speaker]
    pageInfo: PageInfo
  }

  type Session {
    id: ID!
    title: String!
    eventYear: String
    cursor: String
  }

  type SessionResults {
    datalist: [Session]
    pageInfo: PageInfo
  }

  type Query {
    speakers(offset: Int! = 0, limit: Int! = -1): SpeakerResults
    speakersConcat(limit: Int = -1, afterCursor: String = ""): SpeakerResults
    sessionsConcat(limit: Int = -1, afterCursor: String = ""): SessionResults
  }

  type Mutation {
    addSpeaker(speaker: SpeakerInput!): Speaker
    toggleSpeakerFavorite(speakerId: Int!): Speaker
    deleteSpeaker(speakerId: Int!): Speaker
  }
`;

const resolvers: IResolvers = {
  Query: {
    speakers: async (parent, args, context, info) => {
      const { offset, limit } = args;
      const { data } = await axios.get(`${DB_URI}/speakers`);
      return {
        datalist: (data as Record<string, any>[]).filter((_, index) => {
          return index > offset - 1 && (offset + limit > index || limit === 1);
        }),
        pageInfo: {
          totalItemCount: data.length,
        },
      };
    },
    speakersConcat: async (parent, args, context, info) => {
      const { limit, afterCursor } = args;
      const { data: arrAllSpeakers } = await axios.get(`${DB_URI}/speakers`);

      const arrSortedByName = (arrAllSpeakers as SpeakerType[]).sort(
        (objCurrent, objNext) => objCurrent.last!.localeCompare(objNext.last!)
      );

      const offsetIndex = getOffsetCustom(arrSortedByName, afterCursor);

      const datalist = (arrAllSpeakers as SpeakerType[])
        .filter((_, index) => {
          return (
            index > offsetIndex - 1 &&
            (offsetIndex + limit > index || limit === 1)
          );
        })
        .map((objSpeaker) => {
          objSpeaker.cursor = getCursor(objSpeaker.id);
          return objSpeaker;
        });

      const pageInfo: PageInfoType = {
        totalItemCount: arrAllSpeakers.length,
        lastCursor:
          datalist.length > 0
            ? getCursor(datalist[datalist.length - 1].id)
            : "",
        hasNextPage: offsetIndex + datalist.length < arrAllSpeakers.length,
      };

      return { datalist, pageInfo };
    },
    sessionsConcat: async (parent, args, context, info) => {
      const { limit, afterCursor } = args;
      const { data: arrAllSessions } = await axios.get(`${DB_URI}/sessions`);

      const arrSortedByName = (arrAllSessions as SessionType[]).sort(
        (objCurrent, objNext) =>
          objCurrent.eventYear!.localeCompare(objNext.eventYear!)
      );

      const offsetIndex = getOffsetCustom(arrSortedByName, afterCursor);

      const datalist = (arrAllSessions as SessionType[])
        .filter((_, index) => {
          return (
            index > offsetIndex - 1 &&
            (offsetIndex + limit > index || limit === 1)
          );
        })
        .map((objSession) => {
          objSession.cursor = getCursor(objSession.id);
          return objSession;
        });

      const pageInfo: PageInfoType = {
        totalItemCount: arrAllSessions.length,
        lastCursor:
          datalist.length > 0
            ? getCursor(datalist[datalist.length - 1].id)
            : "",
        hasNextPage: offsetIndex + datalist.length < arrAllSessions.length,
      };

      return { datalist, pageInfo };
    },
  },
  Speaker: {
    sessions: async (parent, args, context, info) => {
      const speakerId = parent.id;
      const responseSessions = await axios.get(`${DB_URI}/sessions`);
      const responseSessionSpeakers = await axios.get(
        `${DB_URI}/sessionSpeakers`
      );

      const sessionIds: String[] = responseSessionSpeakers.data
        .filter(
          (objSessionSpeaker: SessionSpeakerType) =>
            objSessionSpeaker.speakerId === speakerId
        )
        .map(
          (objSessionSpeaker: SessionSpeakerType) => objSessionSpeaker.sessionId
        );

      const speakerSessionsResult: SessionType[] = responseSessions.data
        .filter((objSession: SessionType) => sessionIds.includes(objSession.id))
        .sort((objCurrent: SessionType, objNext: SessionType) =>
          objCurrent.eventYear!.localeCompare(objNext.eventYear!)
        );

      return speakerSessionsResult;
    },
  },
  Mutation: {
    addSpeaker: async (parent, args, context, info) => {
      const { first, last, favorite } = args.speaker;
      const { data: speakers } = await axios.get(`${DB_URI}/speakers`);
      const foundSpeaker = speakers.find((objSpeaker: SpeakerType) => {
        return objSpeaker.first === first && objSpeaker.last === last;
      });

      if (foundSpeaker) {
        throw new UserInputError(`Speaker ${first} ${last} already exists.`, {
          invalidArgs: Object.keys(args),
        });
      }

      const { data: newSpeaker } = await axios.post(`${DB_URI}/speakers`, {
        first,
        last,
        favorite,
      });

      return newSpeaker;
    },
    deleteSpeaker: async (parent, args, context, info) => {
      const { data: foundSpeaker } = await axios.get(
        `${DB_URI}/speakers/${args.speakerId}`
      );
      await axios.delete(`${DB_URI}/speakers/${args.speakerId}`);
      return foundSpeaker;
    },
    toggleSpeakerFavorite: async (parent, args, context, info) => {
      const { data: foundSpeaker } = await axios.get(
        `${DB_URI}/speakers/${args.speakerId}`
      );
      const toggledSpeaker = {
        ...foundSpeaker,
        favorite: !foundSpeaker.favorite,
      };

      await axios.put(`${DB_URI}/speakers/${args.speakerId}`, toggledSpeaker);
      return toggledSpeaker;
    },
  },
};

const apolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const PORT = process.env.PORT || 4000;

  try {
    await server.listen(PORT, () => {
      console.log(`Server starting at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

apolloServer();
