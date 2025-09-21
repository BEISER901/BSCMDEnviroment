const saveFile = require('fs').writeFileSync;

const pkgJsonPath = process.argv[2] + "/package.json";

const json = require(pkgJsonPath);
if (!json.hasOwnProperty('scripts')) {
  json.scripts = {};
}

json.scripts['cmd'] = "node " + process.cwd() + "/RunCMD.js";

saveFile(pkgJsonPath, JSON.stringify(json, null, 2));