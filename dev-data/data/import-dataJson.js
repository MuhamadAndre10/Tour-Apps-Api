const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const Tour = require('../../model/tourModel');
const Review = require('../../model/reviewModel');
const Tour = require('../../model/tourModel');
const User = require('../../model/userModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info('DB connection successful!');
  });

const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));

const importData = async () => {
  try {
    await Review.create(reviews);
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    console.info('data created successfully');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Review.deleteMany();
    await User.deleteMany();
    await Tour.deleteMany();
    console.info('data deleted successfully');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
