const { ApolloServer } = require('apollo-server');
const schema = require('./schema');

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  // eslint-disable-next-line
  console.log(`🚀  Server ready at ${url}`);
});
