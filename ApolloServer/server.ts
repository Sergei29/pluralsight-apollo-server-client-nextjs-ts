import { gql, ApolloServer, UserInputError, IResolvers } from "apollo-server";
import axios from "axios";

const DB_URI = "http://localhost:5000";

const typeDefs = gql`
  type Speaker {
    id: ID!
    first: String
    last: String
    favourite: Boolean
  }

  type SpeakerResults {
    datalist: [Speaker]
  }

  type Query {
    speakers: SpeakerResults
  }
`;

const resolvers: IResolvers = {
  Query: {
    speakers: async (parent, args, context, info) => {
      const { data } = await axios.get(`${DB_URI}/speakers`);
      return {
        datalist: data,
      };
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
