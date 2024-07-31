/* eslint-disable no-var */
export declare global {
      declare module globalThis {
            var _userSocket: { client_id: string; socket_id: string }[]
            var _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
      }
}
