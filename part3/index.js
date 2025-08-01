require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')

const app = express()

morgan.token('data', (req, res) => JSON.stringify(req.body) )

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => {
      res.json(result)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        res.status(404).end()
      } else {
        res.json(person)
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${Person.length} people</p>
    <p>${Date()}</p>
  `)
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      console.log('deleted', result);
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
        .then(updatedPerson => {
          console.log('updated', updatedPerson);
          res.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) { 
    return res.status(400).json({
      error: "name is missing"
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: "number is missing"
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})