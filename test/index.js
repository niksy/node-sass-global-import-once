var fs = require('fs');
var sass = require('node-sass');
var pify = require('pify');
var test = require('mocha').it;
var equal = require('assert').equal;
var fn = require('../');

function content ( file ) {
	return fs.readFileSync(file, 'utf8');
}

test('index.scss should have "foo", "bar" and "baz" imports', function ( done ) {

	sass.render({
		file: './test/fixtures/input/index.scss',
		importer: [
			fn([
				{
					file: '**/index.scss',
					imports: [
						'foo',
						'baz'
					]
				}
			])
		]
	}, function ( err, result ) {
		if ( err ) {
			throw err;
		}
		equal(result.css.toString(), content('./test/fixtures/expect/index.css'));
		done();
	});

});


test('page.scss should only have "bar" import', function ( done ) {

	sass.render({
		file: './test/fixtures/input/page.scss',
		importer: [
			fn([
				{
					file: '**/index.scss',
					imports: [
						'foo',
						'baz'
					]
				}
			])
		]
	}, function ( err, result ) {
		if ( err ) {
			throw err;
		}
		equal(result.css.toString(), content('./test/fixtures/expect/page.css'));
		done();
	});

});

test('index.scss should only have "foo" and "baz" imports; page.scss should only have "bar" import', function () {

	var render = pify(sass.render);
	var importer = fn([
		{
			file: '**/index.scss',
			imports: [
				'foo',
				'baz'
			]
		},
		{
			file: '**/page.scss',
			imports: [
				'bar'
			]
		}
	]);

	return Promise.all([
		render({
			file: './test/fixtures/input/index.scss',
			importer: [
				importer
			]
		}),
		render({
			file: './test/fixtures/input/page.scss',
			importer: [
				importer
			]
		})
	])
	.then(function ( results ) {
		equal(results[0].css.toString(), content('./test/fixtures/expect/index-page.css'));
		equal(results[1].css.toString(), content('./test/fixtures/expect/page-index.css'));
	})
	.catch(function ( err ) {
		throw err;
	});

});
