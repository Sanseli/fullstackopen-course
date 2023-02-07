import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const Countries = ({ countries, setSelected }) => {
	if (countries.length > 10) {
		return <div>too many matches, specify another filter</div>
	} else if (countries.length > 1) {
		return (
			<>
				{countries.map((country) => (
					<div key={country.numericCode}>
						{country.name} <button onClick={() => setSelected(country)}>show</button>
					</div>
				))}
			</>
		)
	}

	return <></>
}

const Country = ({ country }) => {
	if (!country) {
		return null
	}

	return (
		<div>
			<h2>{country.name}</h2>
			<div>capital {country.capital}</div>
			<div>area {country.area}</div>
			<h3>languages:</h3>
			<ul>
				{country.languages.map((language) => (
					<li key={language.iso639_1}>{language.name}</li>
				))}
			</ul>
			<img src={country.flag} alt={`flag of ${country.name}`} style={{ width: '200px' }} />
		</div>
	)
}

function App() {
	const [countries, setCountries] = useState([])
	const [countriesFilter, setCountriesFilter] = useState('')
	const [selectedCountry, setSelectedCountry] = useState(null)

	useEffect(() => {
		countriesService.getAll().then((countries) => setCountries(countries))
	}, [])

	const handleFilterChange = (event) => {
		setCountriesFilter(event.target.value)
		setSelectedCountry(null)
	}

	const setSelected = (country) => {
		setSelectedCountry(country ? country : null)
	}

	const filteredCountries = countries.filter((country) =>
		countriesFilter.length > 0
			? country.name.toLowerCase().includes(countriesFilter.toLowerCase())
			: true
	)

	return (
		<div>
			<div>
				find countries <input value={countriesFilter} onChange={handleFilterChange} />
			</div>
			<Countries countries={filteredCountries} setSelected={(country) => setSelected(country)} />
			<Country country={filteredCountries.length === 1 ? filteredCountries[0] : selectedCountry} />
		</div>
	)
}

export default App
