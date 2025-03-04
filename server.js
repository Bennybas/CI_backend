// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('Connected to MongoDB (CI Database)'))
//   .catch(err => console.error('Could not connect to MongoDB:', err));

// // Daily Newsletter Schema
// const dailyNewsletterSchema = new mongoose.Schema({
//   therapeutic_area: String,
//   molecule: String,
//   source: String,
//   category: String,
//   date: String,
//   title: String,
//   content_link: String,
//   current_date: String,
//   google_category: String,
//   latest_result: String,
//   category_id: String
// });

// // Model
// const DailyNewsletter = mongoose.model('DailyNewsletter', dailyNewsletterSchema, 'dailynewsletter');

// // Routes
// app.get('/api/daily_newsletters', async (req, res) => {
//   try {
//     const newsletters = await DailyNewsletter.find();
//     res.json(newsletters);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// const PORT = 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`Daily Newsletter endpoint: http://localhost:${PORT}/api/daily_newsletters`);
// });


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB (CI Database)"))
  .catch((err) => console.error("❌ Could not connect to MongoDB:", err));

// Daily Newsletter Schema
const dailyNewsletterSchema = new mongoose.Schema({
  therapeutic_area: String,
  molecule: String,
  source: String,
  category: String,
  date: String,
  title: String,
  content_link: String,
  current_date: String,
  google_category: String,
  latest_result: String,
  category_id: String,
});

// Model
const DailyNewsletter = mongoose.model(
  "DailyNewsletter",
  dailyNewsletterSchema,
  "dailynewsletter"
);

// Routes
app.get("/api/daily_newsletters", async (req, res) => {
  try {
    const newsletters = await DailyNewsletter.find();
    res.json(newsletters);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📌 Daily Newsletter endpoint: http://localhost:${PORT}/api/daily_newsletters`);
});
