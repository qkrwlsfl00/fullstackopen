const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('data', (req, res) => JSON.stringify(req.body) )

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/api/persons', (req, res) => {
  res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if(!person) {
    return res.status(404).end()
  } else {
    res.send(person)
  }
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
  `)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id

  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

const generateId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  //body.id = generateId() << 이러면 req 자체를 바꿈 body가 포인터니까. req 내용을 맘대로 바꾸고있음 side effect임

  if (!body.name) { 
    return res.status(400).json({
      error: "name is missing"
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: "number is missing"
    })
  } else if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = { ...body, id: generateId() }
  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})