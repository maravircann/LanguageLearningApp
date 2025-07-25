
import http from 'http'
import app from './app.js'
import 'dotenv/config';


const PORT = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

