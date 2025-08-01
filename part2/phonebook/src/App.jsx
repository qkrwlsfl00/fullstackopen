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
  const [timeoutID, setTimeoutID] = useState(null)

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
    clearTimeout(timeoutID)
    setTimeoutID(setTimeout(() => {
      setNoti(null)
    }, 3000,))
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
            console.log(error);
            console.log('error updating', oldPerson.name);
            if (error.status === 404) {
              setPersons(persons.filter(p => p.id !== oldPerson.id))
              setNewName('')
              setNewNumber('')
              showNoti({
                message: `Information of ${newName} has already been removed from server`,
                isError: true
              })
            } else {
              showNoti({
                message: error.response.data.error,
                isError: true
              })
            }
        
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
      .catch(error => {
        console.log('error adding new person', error);
        showNoti({
          message: error.response.data.error,
          isError: true
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
    const deletingPerson = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${deletingPerson.name}?`)) {
      phonebookService
        .del(id)
        .then(response => {
          console.log('deleted from server', deletingPerson);
          setPersons(persons.filter(person => person.id !== id))
          showNoti({
            message: `deleted ${deletingPerson.name}`,
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