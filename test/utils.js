const http = require("http");
const https = require("https");
const urlModule = require("url");

function consumeResponse(response, callback) {
  const chunks = [];

  response
    .on("data", chunk => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    })
    .on("end", () => {
      callback(null, Buffer.concat(chunks));
    });
}

exports.issueGetAndConsume = function issueGetAndConsume(url, callback) {
  const parsedUrl = urlModule.parse(url);

  const httpModule = parsedUrl.protocol === "https:" ? https : http;

  httpModule
    .get(url)
    .on("response", response => consumeResponse(response, callback))
    .on("error", callback)
    .end();
};
