const Person = ({ person, onDelete }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={onDelete}>delete</button>
    </div>
  )
}

const Persons = ({ persons, onDeletePerson }) => (
  <>
    {persons.map(person =>
      <Person 
        key={person.name} 
        person={person} 
        onDelete={() => onDeletePerson(person.id)} 
      />
    )}
  </>
)

export default Persons