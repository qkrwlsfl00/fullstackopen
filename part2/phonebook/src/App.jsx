import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Filter from "./components/Filter";
import PersonForm from './components/PersonForm';
import Notification from './components/Notification';
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [noti, setNoti] = useState(null)

  useEffect(() => {
    console.log("effect");
    phonebookService
      .getAll()
      .then(initialPhonebook => {
        console.log('promise fulfilled');
        console.log(initialPhonebook);
        setPersons(initialPhonebook)
      })
  }, [])

  const showNoti = (newNoti) => {
    setNoti(newNoti)
    setTimeout(() => {
      setNoti(null)
    }, 3000);
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    const oldPerson = persons.find(person => person.name === newName)

    if (oldPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookService
          .update(oldPerson.id, newPerson)
          .then(returnedPerson => {
            console.log('number changed', returnedPerson);
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            showNoti({
              message: `Updated ${returnedPerson.name}`,
              isError: false
            })
          })
          .catch(error => {
            setPersons(persons.filter(p => p.id !== oldPerson.id))
            setNewName('')
            setNewNumber('')
            showNoti({
              message: `Information of ${newName} has already been removed from server`,
              isError: true
            })
          })
      }
      return
    }

    phonebookService
      .create(newPerson)
      .then(returnedPerson => {
        console.log('person added', returnedPerson);
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNoti({
          message: `Added ${returnedPerson.name}`,
          isError: false
        })
      })
  }

  const handleSearchName = (event) => {
    setSearchName(event.target.value)
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDeletePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id).name}?`)) {
      phonebookService
        .del(id)
        .then(deletedPerson => {
          console.log('deleted from server', deletedPerson);
          setPersons(persons.filter(person => person.id !== id))
          showNoti({
            message: `deleted ${deletedPerson.name}`,
            isError: false
          })
        })
    }
  }

  const personsToShow = searchName 
    ? persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase())) 
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification noti={noti} />
      <Filter searchName={searchName} handleSearchName={handleSearchName}/>
      <h3>add a new</h3>
      <PersonForm 
        onSubmit={addPerson}
        newName={newName} 
        onNameChange={handleNewName}
        newNumber={newNumber}
        onNumberChange={handleNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App