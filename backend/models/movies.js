const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log(error.message)
  })

  const movieDetails = new mongoose.Schema({
    name: String,
    voteAverage: Number,
    popularity: Number,
    year: Number,
    genres: String
  })

  const movieSchema = new mongoose.Schema({
    'userName': String,
    'userEmail': String,
    'like': [movieDetails],
    'dislike': [movieDetails],
    'unwatched': [movieDetails],
  })

  movieSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Movie', movieSchema)