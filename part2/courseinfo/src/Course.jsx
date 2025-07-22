const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => (
  <div> 
    {parts.map(part => <Part key={part.id} part={part} />)}
  </div>
)

const Total = ({ total }) => <p><b>Total of {total} exercises</b></p>

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total total={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
  </div>
)

export default Course