import { ifErr } from './iferr'

describe('ifErr', () => {
  it('ifErr.throw throws on err', done => {
    expect(()=>{
      ifErr.throw(new Error('myError'), 1, (err, x) => {
        throw new Error('should throw, not call next')
        done()
      })
    }).toThrow('myError')
    done()
  })
  it('ifErr.throw do not throws on success', done => {
    ifErr.throw(null, 1, (err, x) => {
      expect(err).toEqual(null)
      expect(x).toEqual(1)
      done()
    })
  })
  it('ifErr.clear clears err', done => {
    ifErr.clear(new Error('error should be cleared'), 1, (err, x) => {
      expect(err).toEqual(null)
      expect(x).toEqual(1)
      done()
    })
  })
  it('ifErr.return does not proceeds if err', done => {
    ifErr.return(new Error('myError'), 1, (err, x) => {
      throw new Error('should have returned')
    })
    setTimeout(()=>{
      done()
    }, 10)
  })
  it('ifErr.return proceeds if ok', done => {
    ifErr.return(null, 1, (err, x) => {
      expect(x).toEqual(1)
      done()
    })
  })
  it('ifErr.call', done => {
    let myErr = new Error('myError')
    ifErr.call((err, x) => {
      expect(err).toEqual(myErr)
      expect(x).toEqual(1)
      done()
    })(myErr,1, () => {
      throw 'should have finished'
    })
  })
})
