const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through = require('through');

function pluginError (message) {
  return new PluginError('gulp-pug-template-concat', message);
}

module.exports = function pugConcat(fileName, _opts) {
  _opts = _opts || {};

  if (!fileName) {
    throw pluginError('Missing fileName');
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

    // isolate filename from full path
    var filename = file.path.replace(file.base, '').replace('.js', '');

    // split pug helpers and a template function and replace template name with filename
    var splittedTemplate = file.contents.toString().split('function template');

    pugHelpers = pugHelpers || splittedTemplate[0];
    concatString += `${JSON.stringify(filename)}:function ${splittedTemplate[1]},\n`;
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
      path: fileName,
      contents: new Buffer(templateString)
    }));

    this.queue(null);
  }

  return through(write, end);
}
