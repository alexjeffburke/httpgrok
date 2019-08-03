# httpgrok

This provides a node require hook that will record all HTTP traffic.

## Use

The module can be pulled into your project by simply running:

```
npm install --save-dev httpgrok
```

Once installed, alter the line used to execute mocha - typically the
`npm test` target in your package.json file so it requires the hook:

```
node -r httgrok ...
```

## Output

When used as a hook in a process the hook will start observing any
requests made by your code the the responses it receives - then on
process exit these exchanges will be written to stderr. For example,
node code issuing a GET request to `"https://reqres.in/api/unknown/23"`
would output:

```json
[
  {
    "request": {
      "url": "GET /api/unknown/23",
      "headers": { "Host": "reqres.in" },
      "host": "reqres.in",
      "port": 443
    },
    "response": {
      "statusCode": 404,
      "body": {}
    }
  }
]
```

The JSON that is output is the same declarative syntax as is understood
by the unit testing assertions within the
[unexpected-mitm](https://github.com/unexpectedjs/unexpected-mitm)
plugins and their programmatic wrapper
[httpcetion](https://github.com/papandreou/httpception).
