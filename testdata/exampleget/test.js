const utils = require("../../test/utils");

describe("exampleproject", () => {
  it("should ignore less", done => {
    utils.issueGetAndConsume("https://reqres.in/api/users/2", done);
  });
});
