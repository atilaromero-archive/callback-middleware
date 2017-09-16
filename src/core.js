export const callNext = (err, ...args) => {
  let next = args.pop()
  next(err, ...args)
}

export const addErr = fn => (err, ...args) => fn(...args)

export const preserveErr = fn => (err1, ...input) => {
  let next = input.pop()
  return fn(err1, ...input, (err2, ...output) => {
    if (!err2) { err2 = err1 }
    next(err2, ...output)
  })
}

// cb: takes an async function
//   (...input, next) => next(...output)
// and makes it an error first callback function
//   (err, ...input, next) => next(...output)
// Since the err parameter is simply ignored,
// it must be preceded by an error treatment function in the
// middleware chain, like this:
//  middleware(
//    ifErr.return,
//    cb(myFunc)
//  )(null, ...input,() => {})
export const cb = fn => preserveErr(addErr(fn))

export const toAsync = fn => (...args) => {
  let next = args.pop()
  let result
  try {
    result = fn(...args)
  } catch (err) {
    return next(err)
  }
  next(null, result)
}

export const middleware = (fn, ...fns) => (
  (!fn) ?
  callNext :
  (err1, ...input) => {
    let next = input.pop()
    return fn(err1, ...input, (err2, ...output) => middleware(...fns)(err2, ...output, next))
  }
)
