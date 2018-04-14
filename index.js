const path = require('path');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through = require('through');

function pluginError (message) {
  return new PluginError('gulp-pug-template-concat', message);
}

module.exports = function pugConcat(targetFileName, _opts) {
  _opts = _opts || {};

  if (!targetFileName) {
    throw pluginError('Missing targetFileName');
  }

  var concatString = '';
  var pugHelpers = '';

  function write (file) {
    if (file.isNull()) {
      return;
    }
    if (file.isStream()) {
      return this.emit('error', pluginError('Streaming not supported'));
    }

    // isolate file name from full path
    var fileName = file.path.split(path.sep).pop().replace('.js', '');

    // split pug helpers and a template function and replace template name with file name
    var splittedTemplate = file.contents.toString().split('function template');

    pugHelpers = pugHelpers || splittedTemplate[0];
    concatString += `${JSON.stringify(fileName)}:function ${splittedTemplate[1]},\n`;
  }

  function end () {
    // wrap concatenated string in template object
    var templateString;
    if(_opts.commonJS) {
      templateString = 'module.exports'
    } else {
      templateString = `var ${_opts.templateVariable || 'templates'}`;
    }
    templateString += `=(function(){\n${pugHelpers}\n;return {\n${concatString}}})();`;

    this.queue(new gutil.File({
      path: targetFileName,
      contents: new Buffer(templateString)
    }));

    this.queue(null);
  }

  return through(write, end);
};
