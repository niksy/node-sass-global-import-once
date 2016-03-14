var sass = require('node-sass');
var minimatch = require('minimatch');

module.exports = function ( defs ) {
	return function ( val, file, done ) {

		var shouldExclude = defs.reduce(function ( prev, def ) {
			if ( !minimatch(file, def.file) && def.imports.indexOf(val) !== -1 ) {
				return prev + 1;
			}
			return prev;
		}, 0);

		if ( shouldExclude ) {
			done({ contents: '' });
		} else {
			return sass.NULL;
		}

	};
};
