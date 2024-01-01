const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
require('dotenv').config()

const Movie = require('./models/movies')

app.get('/api/movies', (req, res) => {
    Movie.find({})
      .then(movies => {
        res.json(movies)
      })
      .catch(error => console.log(error))
})

function create_json_obj(data, movies) {
    for (var i=0; i<movies.length; i++) {
        var movie = movies[i]
        var padding = '  '
        var two_padding = padding + padding
        var three_padding = two_padding + padding
        data += '\n'
        data += two_padding
        data += '{\n'
        data += three_padding
        data += '"name": '
        data += `"${movie.name}",`
        data += '\n'
        data += three_padding
        data += '"voteAverage": '
        data += `"${movie.voteAverage}",`
        data += '\n'
        data += three_padding
        data += '"popularity": '
        data += `"${movie.popularity}",`
        data += '\n'
        data += three_padding
        data += '"year": '
        data += `"${movie.year}",`
        data += '\n'
        data += three_padding
        data += '"genres": '
        data += `"${movie.genres}"`
        data += '\n'
        data += two_padding
        data += '}'
        if (i != movies.length-1) {
            data += ','
        }
    }
    return data
}

function output_data(body) {
    console.log("Outputing data to a text file")
    const fs = require('fs')
    var padding = '  '
    var data = '{\n'
    data += padding
    data += '"UserName": '
    data += `"${body.userName}",`
    data += '\n'
    data += padding
    data += '"UserEmail": '
    data += `"${body.userEmail}",`
    data += '\n'
    data += padding
    data += '"Dislike": ['
    data = create_json_obj(data, body.dislike)
    data += '\n'
    data += padding
    data += '],\n'
    data += padding
    data += '"Like": ['
    data = create_json_obj(data, body.like)
    data += '\n'
    data += padding
    data += '],\n'
    data += padding
    data += '"Unwatched": ['
    data = create_json_obj(data, body.unwatched)
    data += '\n'
    data += padding
    data += ']'
    data += '\n'
    data += '}'

    fs.writeFile('./algorithm/data.txt', data, (err) =>  {
        if (err) throw err;
      })

}
app.post('/api/movies/', (req, res) => {
    console.log("get in post")
    const body = req.body
    output_data(body)
    const object = {
        userName: body.userName,
        userEmail: body.userEmail,
        like: body.like,
        dislike: body.dislike,
        unwatched: body.unwatched,
    }
    const movie = new Movie(object)
    movie.save()
        .then(savedMovie => {
            res.json(savedMovie)
        })
        .catch(error => console.log(error))
})

app.delete('/api/movies/:id', (req, res) => {
    Movie.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => console.log(error))
})

app.put('/api/movies/:id', (req, res) => {
    console.log("get in put")
    const body = req.body
    output_data(body)
    Movie.findByIdAndUpdate({_id: req.params.id },
    {
        "$set": {
            userName: body.userName,
            userEmail: body.userEmail,
            like: body.like,
            dislike: body.dislike,
            unwatched: body.unwatched
        }
    }, {new : true})
    .then(updatedMovie => {
        res.json(updatedMovie)
    })
    .catch(error => console.log(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})