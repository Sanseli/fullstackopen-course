import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const Countries = ({ countries, countriesFilter }) => {
	const filteredCountries = countries.filter((country) =>
		countriesFilter.length > 0
			? country.name.toLowerCase().includes(countriesFilter.toLowerCase())
			: true
	)

	if (filteredCountries.length > 10) {
		return <div>too many matches, specify another filter</div>
	} else if (filteredCountries.length > 1) {
		return filteredCountries.map((country) => <div key={country.numericCode}>{country.name}</div>)
	} else if (filteredCountries.length === 1) {
		let country = filteredCountries[0]
		return (
			<div>
				<h2>{country.name}</h2>
				<div>capital {country.capital}</div>
				<div>area {country.area}</div>
				<h3>languages:</h3>
				<ul>
					{country.languages.map((language) => (
						<li>{language.name}</li>
					))}
				</ul>
				<img src={country.flag} alt={`flag of ${country.name}`} style={{ width: '200px' }} />
			</div>
		)
	}
}

function App() {
	const [countries, setCountries] = useState([])
	const [countriesFilter, setCountriesFilter] = useState('')

	useEffect(() => {
		countriesService.getAll().then((countries) => setCountries(countries))
	}, [])

	const handleFilterChange = (event) => setCountriesFilter(event.target.value)

	return (
		<div>
			<div>
				find countries <input value={countriesFilter} onChange={handleFilterChange} />
			</div>
			<Countries countries={countries} countriesFilter={countriesFilter} />
		</div>
	)
}

export default App
