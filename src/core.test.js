import {
  cb,
  toAsync,
  middleware
} from './core'

describe('toAsync', () => {
  it('works with 1 arg', done => {
    toAsync(x => x+1)(10, (err, result) => {
      expect(err).toEqual(null)
      expect(result).toEqual(11)
      done()
    })
  })
  it('works with cb', done => {
    cb(toAsync(x => x+1))(true, 10, (err, result) => {
      expect(err).toEqual(true)
      expect(result).toEqual(11)
      done()
    })
  })
})

describe('middleware', () => {
  it('halts execution on null', done => {
    middleware(
      null,
      cb(toAsync(x=>x*10))
    )(null,1,(err, result) => {
      expect(err).toEqual(null)
      expect(result).toEqual(1)
      done()
    })
  })
  it('calls 1 function', (done) => {
    middleware(
      (err, x, next) => next(err, x*2)
    )(null, 1, (err, x, next) => {
      expect(x).toEqual(2)
      done()
    })
  })
  it('calls more functions', (done) => {
    middleware(
      cb(toAsync(x=>x*2)),
      cb(toAsync(x=>x*3)),
      cb(toAsync(x=>x*10)),
      cb(toAsync(x=>x+0.5)),
    )(null, 1, (err, x, next) => {
      expect(x).toEqual(60.5)
      expect(err).toEqual(null)
      done()
    })
  })
  it('works with multiple arguments', (done) => {
    middleware(
      cb((x,next) => next(null,x,2)),
      cb((x,y,next) => next(null,x+y,10,100)),
      cb((x,y,z,next) => next(null,x+y+z)),
    )(null, 1, (err, x, next) => {
      expect(x).toEqual(113)
      expect(err).toEqual(null)
      done()
    })
  })
  it('calls 100 functions', (done) => {
    const fns = Array(100).fill(cb(toAsync(x=>x+1)))
    middleware(...fns)(null, 0, (err, x, next) => {
      expect(x).toEqual(100)
      done()
    })
  })
  it('calls 10000 functions with setImmediate', (done) => {
    const fns = Array(10000).fill((err,x,next) => setImmediate(() => next(err, x+1)))
    middleware(...fns)(null, 0, (err, x, next) => {
      expect(x).toEqual(10000)
      done()
    })
  })
})

describe('ifErr', () => {

})

// middleware(
//   printTaskCb,
//   cb(reserveTask),
//   printTaskCb,
//   ifErr.call(middleware(ifErr.log, cb(giveUpTask), halt)),
//   // cb(brokenTask),
//   printTaskCb,
//   ifErr.call(middleware(ifErr.log, cb(giveUpTask), halt)),
//   // cb(doTask),
//   cb(doBadTask),
//   printTaskCb,
//   ifErr.call(middleware(cb(markError), printTaskCb, halt)),
//   cb(markDone),
//   printTaskCb,
// )(null, {}, ()=>{})
