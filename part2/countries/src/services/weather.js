import axios from 'axios'
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`

const getByCountry = (country) => {
	const lat = country.latlng[0]
	const lon = country.latlng[1]

	return axios.get(baseUrl + `&lat=${lat}&lon=${lon}`).then((response) => response.data)
}

export default { getByCountry }
