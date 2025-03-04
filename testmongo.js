// test-connection.js
require('dotenv').config();
const mongoose = require('mongoose');

// Environment variables
const username = encodeURIComponent(process.env.MONGO_USER || "CI.Reports@chryselys.com");
const password = encodeURIComponent(process.env.MONGO_PASS || "ZX12cvbn2024");

// IMPORTANT: Replace this with your exact connection string from MongoDB Atlas
// Only keep the cluster part (everything after @ and before /)
const clusterUrl = "your-cluster-name.mongodb.net"; // REPLACE THIS

const mongoURI = `mongodb+srv://${username}:${password}@cluster0.mtfob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log('Attempting to connect with URI (credentials masked):');
console.log(mongoURI.replace(password, '********'));

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    mongoose.connection.db.admin().listDatabases()
      .then(result => {
        console.log('Available databases:');
        result.databases.forEach(db => {
          console.log(`- ${db.name}`);
        });
        process.exit(0);
      });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });