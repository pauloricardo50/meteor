const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const os = require('os');

function generateConfig(configPath, baseDomain) {
  const contentPath = path.resolve(__dirname, configPath);
  const content = fs.readFileSync(contentPath).toString();
  const outputPath = path.resolve(os.tmpdir(), `nginx-config-${Math.random()}`);

  const output = ejs.render(content, {
    baseDomain
  }, {
    filename: contentPath
  });

  fs.writeFileSync(outputPath, output);

  process.on('exit', () => {
    fs.unlinkSync(outputPath);
  });

  return outputPath;
}

module.exports = {
  generateConfig,
}
