import {
  callNext
} from './core'

export const ifErr = {
  log: (err, ...input) => {
    if (err) { console.log(err) }
    callNext(err, ...input)
  },
  throw: (err, ...input) => {
    if (err) { throw err }
    callNext(err, ...input)
  },
  clear: (err, ...input) => {
    callNext(null, ...input)
  },
  return: (err, ...input) => {
    if (err) { return }
    callNext(err, ...input)
  },
  call: fn => (err, ...input) => {
    if (err) { return fn(err, ...input) }
    callNext(err, ...input)
  }
}
