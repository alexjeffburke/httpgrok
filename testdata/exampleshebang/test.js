#!/usr/bin/env node

const utils = require("../../test/utils");

describe("exampleshebang", () => {
  it("should ignore less", done => {
    utils.issueGetAndConsume("https://reqres.in/api/unknown/23", done);
  });
});
