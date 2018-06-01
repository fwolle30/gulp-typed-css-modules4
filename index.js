const through = require('through2');
const TCM = require('typed-css-modules');

function typeModule (options, file) {
  let creator = new TCM(options);
  return creator.create(file.path, file.contents)
    .then(content => {
      content.resultList.unshift('export namespace style {');
      content.resultList.push('}');
      content.resultList.push('export default style;');

      let newFile = file.clone();

      newFile.contents = Buffer.from(content.formatted);
      newFile.path += '.d.ts';

      return newFile;
    });
}

module.exports = function (options) {
  return through.obj(function (file, encoding, callback) {
    typeModule(options, file)
      .then((newFile) => {
        this.push(file);
        callback(null, newFile);
      });
  });
};
