import axios from 'axios'
const baseUrl = 'https://restcountries.com/v2/all'

const getAll = () => {
	return axios.get(baseUrl).then((response) => response.data)
}

export default { getAll }
