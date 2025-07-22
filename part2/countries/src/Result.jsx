import CountryInfo from "./CountryInfo"

const Result = ({ countries, onShow }) => {
  if (countries.length === 0) {
    return null
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => 
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => onShow(country.name.common)}>Show</button>
          </div>
        )}
      </div>
    )
  }

  console.log('the one country', countries[0].name.common);

  if (countries.length === 1) {
    return (
      <CountryInfo country={countries[0]} />
    )
  }
}

export default Result