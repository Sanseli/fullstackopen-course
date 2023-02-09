import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import weatherService from './services/weather'

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

const Weather = ({ weather }) => {
	if (!weather) {
		return null
	}

	return (
		<div>
			<h3>{weather.name}</h3>
			<div>temperature {weather.main.temp} Celcius</div>
			<img
				src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
				alt={`icon ${weather.weather[0].description}`}
			></img>
			<div>wind {weather.wind.speed} m/s</div>
		</div>
	)
}

function App() {
	const [countries, setCountries] = useState([])
	const [filter, setFilter] = useState('')
	const [filteredCountries, setFilteredCountries] = useState([])
	const [selectedCountry, setSelectedCountry] = useState(null)
	const [selectedCountryWeather, setSelectedCountryWeather] = useState(null)

	useEffect(() => {
		countriesService.getAll().then((countries) => setCountries(countries))
	}, [])

	const handleFilterChange = (event) => {
		const filter = event.target.value
		const filtered = countries.filter((country) =>
			filter.length > 0 ? country.name.toLowerCase().includes(filter.toLowerCase()) : true
		)
		setFilter(filter)
		setFilteredCountries(filtered)

		if (filtered.length === 1) {
			setSelected(filtered[0])
		} else {
			setSelectedCountry(null)
			setSelectedCountryWeather(null)
		}
	}

	const setSelected = (country) => {
		setSelectedCountry(country ? country : null)

		if (country) {
			getWeatherInformation(country)
		}
	}

	const getWeatherInformation = (country) => {
		if (country) {
			return weatherService
				.getByCountry(country)
				.then((weather) => setSelectedCountryWeather(weather))
		}
	}

	return (
		<div>
			<div>
				find countries <input value={filter} onChange={handleFilterChange} />
			</div>
			<Countries countries={filteredCountries} setSelected={(country) => setSelected(country)} />
			<Country country={filteredCountries.length === 1 ? filteredCountries[0] : selectedCountry} />
			<Weather weather={selectedCountryWeather} />
		</div>
	)
}

export default App
