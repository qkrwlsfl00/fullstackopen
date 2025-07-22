import { useState, useEffect } from 'react'
import axios from 'axios'
import Result from './Result'


const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('effect');
        setCountries(response.data)
      })
  }, [])
  
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )
  console.log('countries', countries);
  console.log(filteredCountries);

  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  const handleShow = (country) => {
    setSearch(country)
  }

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleChange} />
      </div>
      <Result countries={filteredCountries} onShow={handleShow} />
    </div>
  )
}

export default App