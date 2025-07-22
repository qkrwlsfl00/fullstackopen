import Weather from "./Weather"

const CountryInfo = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      capital {country.capital} 
      <br />
      area {country.area}
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(l => 
          <li key={l}>{l}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}/>
      <Weather location={country.capital[0]} />
    </div>
  )
}

export default CountryInfo