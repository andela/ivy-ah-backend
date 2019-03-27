const { expect } = require('chai');

describe(('It should return the sum of two numbers'), () => {
  it('It should return 4 for the sum of 2 + 2', () => {
    const y = 2;
    const z = 2;
    const result = z + y;
    expect(result).to.equal(4);
  });
});
