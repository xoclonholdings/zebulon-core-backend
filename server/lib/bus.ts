import { Client } from 'pg';

export function busNotify(tile: string, type: string, payload: any) {
  // TODO: use pg NOTIFY
}

export function busListen(handler: (msg: any) => void) {
  // TODO: use pg LISTEN
}
