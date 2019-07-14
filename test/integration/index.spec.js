const unexpected = require("unexpected");
const path = require("path");
const { spawn } = require("child_process");

const BASE_DIR = path.join(__dirname, "..", "..");
const MOCHA_BIN = path.join(BASE_DIR, "node_modules", ".bin", "mocha");
const TESTDATA = path.join(BASE_DIR, "testdata");

function spawnMochaInDir(cwd, args) {
  const spawnedCli = spawn(MOCHA_BIN, args, {
    cwd
  });

  const p = new Promise((resolve, reject) => {
    let sawExit = false;
    let stdout = "";
    let stderr = "";

    spawnedCli.stdout.on("data", chunk => {
      stdout += chunk.toString("utf8");
    });

    spawnedCli.stderr.on("data", chunk => {
      stderr += chunk.toString("utf8");
    });

    const makeError = code => {
      const error = new Error("spawnCli error");
      error.code = code;
      error.stdout = stdout;
      error.stderr = stderr;
      return error;
    };

    spawnedCli.on("error", err => {
      if (sawExit) {
        return;
      }

      sawExit = true;

      reject(makeError(null));
    });

    spawnedCli.on("exit", code => {
      if (sawExit) {
        return;
      }

      sawExit = true;

      if (code) {
        reject(makeError(code));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });

  p._spawn = spawnedCli;

  return p;
}

describe("integration", () => {
  const expect = unexpected.clone();

  expect.addAssertion(
    "<string> when parsed as JSON <assertion>",
    (expect, subject) => {
      let parsed;

      try {
        parsed = JSON.parse(subject);
      } catch (e) {}

      if (parsed === undefined) {
        expect.fail("The payload could not be parsed as valid JSON.");
      }

      return expect.shift(parsed);
    }
  );

  it("should work for a simple GET", () => {
    const cwd = path.join(TESTDATA, "exampleget");

    return expect(
      () => spawnMochaInDir(cwd, ["-r", "../../register"]),
      "to be fulfilled"
    ).then(result =>
      expect(result.stderr, "when parsed as JSON", "to satisfy", [
        {
          request: {
            url: "GET /api/users/2",
            headers: { Host: "reqres.in" },
            host: "reqres.in",
            port: 443
          },
          response: {
            body: {
              data: {
                id: 2,
                email: "janet.weaver@reqres.in",
                first_name: "Janet",
                last_name: "Weaver"
              }
            }
          }
        }
      ])
    );
  });

  it("should work for a simple GET returning 404", () => {
    const cwd = path.join(TESTDATA, "exampleget404");

    return expect(
      () => spawnMochaInDir(cwd, ["-r", "../../register"]),
      "to be fulfilled"
    ).then(result =>
      expect(result.stderr, "when parsed as JSON", "to satisfy", [
        {
          request: {
            url: "GET /api/unknown/23",
            headers: { Host: "reqres.in" },
            host: "reqres.in",
            port: 443
          },
          response: {
            statusCode: 404,
            body: {}
          }
        }
      ])
    );
  });
});
