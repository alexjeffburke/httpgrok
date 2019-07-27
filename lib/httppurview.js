const { addHook } = require("pirates");
const fs = require("fs");
const path = require("path");

let preamble = fs.readFileSync(
  path.join(__dirname, "templates/preamble"),
  "utf8"
);

// ensure absolute path so the module is accessible in the nested context
const resolvePath = path.resolve(
  require.resolve("unexpected-mitm"),
  "..",
  ".."
);

preamble = preamble.replace(/{unexpected-mitm}/g, resolvePath);

const prepareHook = options => {
  const exts = options.moduleFileExtensions || [".js"];
  return { exts };
};

const createHook = options => {
  const { exts } = prepareHook(options);

  addHook(
    code => {
      if (/^#!.*node\n/.test(code)) {
        code = code.replace(/^#!.*node\n/, "");
      }

      return [preamble, code].join("\n");
    },
    { exts }
  );
};

module.exports = createHook;
module.exports.prepareHook = prepareHook;
