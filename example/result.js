'use strict';

// npm install gulp gulp-eslint

var gulp = require('gulp');
var eslint = require('../');

var MAX_WARNINGS = 1;


gulp.task('lint-result', function() {
	var count = 0;

	// Be sure to return the stream; otherwise, you may not get a proper exit code.
	return gulp.src('../test/fixtures/*.js')
		.pipe(eslint())
		.pipe(eslint.formatEach())
		.pipe(eslint.result(function(result) {
			count += result.warningCount;

			if (count > MAX_WARNINGS) {
				// Report which file exceeded the limit
				// The error will be wraped in a gulp PluginError
				throw {
					name: 'TooManyWarnings',
					fileName: result.filePath,
					message: 'Too many warnings!',
					showStack: false
				};
			}
		}));
});

gulp.task('lint-resu1lt-async', function() {
	var count = 0;

	return gulp.src('../test/fixtures/*.js')
		.pipe(eslint())
		.pipe(eslint.formatEach())
		.pipe(eslint.result(function(result, done) {

			// As a basic example, we'll use process.nextTick as an async process.
			process.nextTick(function asyncStub() {
				count += result.warningCount;

				var error = null;
				if (count > MAX_WARNINGS) {
					// Define the error. Any non-null/undefined value will work
					error = {
						name: 'TooManyWarnings',
						fileName: result.filePath,
						message: 'Too many warnings!',
						showStack: false
					};
				}
				done(error);

			}, 100);

		}));
});

gulp.task('lint-results', function() {
	return gulp.src('../test/fixtures/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.results(function(results) {
			// results.warningCount is an array of file result
			// that includes warningsCount and errorCount totals.
			if (results.warningCount > MAX_WARNINGS) {
				// No specific file to complain about here.
				throw new Error('Too many warnings!');
			}
		}));
});

gulp.task('lint-results-async', function() {
	return gulp.src('../test/fixtures/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.results(function(results, done) {

			// Another async example...
			process.nextTick(function asyncStub() {

				var error = null;
				if (results.warningCount > MAX_WARNINGS) {
					error = new Error('Too many warnings!');
				}
				done(error);

			}, 100);

		}));
});

gulp.task('default', ['lint-results']);
