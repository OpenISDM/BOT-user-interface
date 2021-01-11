import { Server } from 'socket.io'
import { pgClient } from '../api/db/connection'

const io = new Server()

pgClient.connect()
pgClient.query('LISTEN watchers')

io.on('connection', (socket) => {
	socket.emit('connected', { connected: true })

	socket.on('getMessage', (message) => {
		console.log(message)
		socket.emit('getMessage', message)
		pgClient.on('notification', function (data) {
			socket.emit('getMessage', JSON.parse(data.payload))
		})
	})
})

export const attach = (server) => io.attach(server)

export default {
	attach,
}
