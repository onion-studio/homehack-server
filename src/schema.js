const { gql, makeExecutableSchema } = require('apollo-server');
const Cycle = require('./models/Cycle');

const typeDefs = gql`
  type Cycle {
    title: String!
    interval: Int!
  }

  input CycleInput {
    title: String!
    interval: Int!
  }

  type Query {
    cycles: [Cycle!]!
  }

  type Mutation {
    createCycle(input: CycleInput): Cycle
  }
`;

const resolvers = {
  Query: {
    async cycles(parent, args, context, info) {
      return Cycle.find();
    },
  },
  Mutation: {
    async createCycle(parent, args, context, info) {
      const {
        input: { title, interval },
      } = args;
      const cycle = new Cycle({ title, interval });
      return cycle.save();
    },
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
