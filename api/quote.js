const axios = require('axios')

module.exports = async (req, res) => {

  try {

    const response = await axios.get('https://zenquotes.io/api/random')

    res.json(response.data)

  } catch (error) {

    res.status(500).json({ message: 'Failed to fetch quote' })

  }

}