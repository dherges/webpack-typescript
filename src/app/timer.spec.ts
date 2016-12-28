import { Timer } from './timer'

// describe(), it(), expect() are on global-scope (due to jasmine)
describe('Timer application', () => {

  it('has a passing test', () => {
    expect(4).toEqual(4)
  })

  it('has a failing test', () => {
    expect(4).toEqual(2)
  })

  it('creates an instance of Timer', () => {
    let timer = new Timer({})

    expect(timer).not.toBeNull()
  })
})
