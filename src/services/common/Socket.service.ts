import { Socket } from 'socket.io'
import { getCookieValueHeader } from '~/utils/token.utils'

class SocketService {
      static async connection(socket: Socket) {
            const client_id = getCookieValueHeader('client_id', socket.request.headers.cookie!)
            if (client_id) {
                  const found_user = global._userSocket.some((user) => user.client_id === client_id)
                  if (!found_user) {
                        global._userSocket.push({ client_id, socket_id: socket.id })
                  }
            }
            socket.on('disconnect', () => {
                  const client_id = getCookieValueHeader('client_id', socket.request.headers.cookie!)
                  const user_index = global._userSocket.findIndex((user) => (user.client_id = client_id))
                  global._userSocket.splice(user_index, 1)
            })
            socket.on('checkError', (data) => console.log({ data }))
            socket.emit('mai', { id: socket.id })
      }
}

export default SocketService
