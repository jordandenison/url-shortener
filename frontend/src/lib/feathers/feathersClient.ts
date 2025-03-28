import auth from '@feathersjs/authentication-client'
import socketio from '@feathersjs/socketio-client'
// @ts-ignore
import { io } from 'socket.io-client'
import { createClient } from 'backend-client'

import { url } from './config'

export const socket = io(url, {
  transports: ['websocket', 'polling']
})

const connection = socketio(socket, {
  timeout: 30000
})

const feathersClient = createClient(connection)

feathersClient.configure(auth({ storage: window.localStorage }))

export default feathersClient
