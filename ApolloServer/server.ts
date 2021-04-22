import { gql, ApolloServer, UserInputError, IResolvers } from "apollo-server";
import axios from "axios";
import { SpeakerType } from "./types";

const DB_URI = "http://localhost:5000";

const typeDefs = gql`
  type Speaker {
    id: ID!
    first: String
    last: String
    favourite: Boolean
  }

  input SpeakerInput {
    first: String
    last: String
    favourite: Boolean
  }

  type PageInfo {
    totalItemCount: Int
  }

  type SpeakerResults {
    datalist: [Speaker]
    pageInfo: PageInfo
  }

  type Query {
    speakers(offset: Int! = 0, limit: Int! = -1): SpeakerResults
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
