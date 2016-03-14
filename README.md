# node-sass-global-import-once

[![Build Status][ci-img]][ci]

Import Sass files once globally.

Useful when you would want to exclude certain components in output files and leave them only in one location (e.g. one component is imported globally and any other attempt to load it would produce empty string). Goes along nicely with [node-sass-import-once][node-sass-import-once].

## Installation

```sh
npm install node-sass-global-import-once --save
```

## Usage

**`input/index.scss`**

```scss
@import "foo";
@import "bar";
@import "baz";

body {
	color:red;
}
```

**`input/page.scss`**

```scss
@import "foo";
@import "bar";
@import "baz";

body {
	color:red;
}
```

```js
var gio = require('node-sass-global-import-once');
var sass = require('sass');

['./input/index.scss', './input/page.scss'].forEach(function ( file ) {

	sass.render({
		file: file,
		importer: [
			gio([
				{
					file: '**/index.scss',
					imports: [
						'foo',
						'baz'
					]
				}
			]),
			io,
		]
	}, function( err, result ) {
		//=> 
	});

});
```

Given two entry Sass files, CSS output would be:

**`index.css`**

```css
@import "foo";
@import "bar";
@import "baz";

body {
	color:red;
}
```

**`page.css`**

```css
@import "bar";

body {
	color:red;
}
```

`page.css` doesn’t include `foo` and `bar` imports since they should be imported globally only once.

## API

### gio(definitions)

Package expects one argument, array of definitions (object) for global imports.

Each object definitions contains following properties:

#### file

Type: `String`

Name of the file or [minimatch][minimatch] expression which is considered as global entry point.

### imports

Type: `Array`

List of imports as strings which are considered to be global imports. Package only reads exact names defined inside files, so relative filenames which map to certain absolute package names are treated as different packages.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/node-sass-global-import-once
[ci-img]: https://img.shields.io/travis/niksy/node-sass-global-import-once/master.svg
[minimatch]: https://github.com/isaacs/minimatch
[node-sass-import-once]: https://github.com/at-import/node-sass-import-once
