import { gql, ApolloServer, UserInputError, IResolvers } from "apollo-server";
import axios from "axios";
import { SpeakerType, PageInfoType } from "./types";

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
    favourite: Boolean
    cursor: String
  }

  input SpeakerInput {
    first: String
    last: String
    favourite: Boolean
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

  type Query {
    speakers(offset: Int! = 0, limit: Int! = -1): SpeakerResults
    speakersConcat(limit: Int = -1, afterCursor: String = ""): SpeakerResults
  }

  type Mutation {
    addSpeaker(speaker: SpeakerInput!): Speaker
    toggleSpeakerFavourite(speakerId: Int!): Speaker
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
        (objCurrent, objNext) => objCurrent.last.localeCompare(objNext.last)
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
        totalItemCount: datalist.length,
        lastCursor:
          datalist.length > 0
            ? getCursor(datalist[datalist.length - 1].id)
            : "",
        hasNextPage: offsetIndex + datalist.length < arrAllSpeakers.length,
      };

      return { datalist, pageInfo };
    },
  },
  Mutation: {
    addSpeaker: async (parent, args, context, info) => {
      const { first, last, favourite } = args.speaker;
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
        favourite,
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
    toggleSpeakerFavourite: async (parent, args, context, info) => {
      const { data: foundSpeaker } = await axios.get(
        `${DB_URI}/speakers/${args.speakerId}`
      );
      const toggledSpeaker = {
        ...foundSpeaker,
        favourite: !foundSpeaker.favourite,
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
