const mongoose = require('mongoose')
console.log(process.argv.length)
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://qkrwlsfl00:${password}@cluster.mfzhd6p.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log('person saved')
    mongoose.connection.close()
  })
}

if (process.argv.length < 4) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

