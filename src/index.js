require('dotenv/config');
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const schema = require('./schema');

const DB_URL = process.env.DB_URL || 'mongodb://localhost/homehack';

mongoose.connect(DB_URL);

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  // eslint-disable-next-line
  console.log(`🚀  Server ready at ${url}`);
});
