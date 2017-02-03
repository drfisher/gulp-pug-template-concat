# gulp-pug-template-concat
Compiles Pug templates single file containing template functions. Supports commonJS.

Based on [gulp-jade-templates-concat](https://github.com/nStonehouse/gulp-jade-template-concat) by Nicholas Stonehouse.

## Install
```sh
$ npm install --save-dev gulp-pug-template-concat
```

## Usage
### Gulpfile
```javascript
var pug = require('gulp-pug');
var pugConcat = require('gulp-pug-template-concat');

gulp.task("client-templates", function(){
    gulp.src('src/pug/templates/**/*.pug')
        .pipe(pug({
            client: true
        })
        .pipe(pugConcat('mytemplates.js', {
            // uncomment to change templateVariable name. "templates" by default
            // templateVariable: "templates"
            
            // uncomment following line to export templates in commonJS manner
            // commonJS: true        
        }))
        .pipe(gulp.dest('build/templates/'))
});
```

This compiles all of your client side pug templates into a file called `mytemplates.js`.
The `templateVariable` option is optional and will default to `templates` if it is not set.


### HTML/Pug
Link the concatenated file with a script tag
```pug
script(src="templates/mytemplates.js")
```

### Javascript
Access the generated templates using dot or bracket access notation.
```javascript
  templates['template1'];
  templates.template2;
```