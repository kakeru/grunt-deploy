var exec = require('child_process').exec;
var moment = require('moment');

module.exports = function(grunt) {
	pkg = grunt.file.readJSON('package.json');
	setting = grunt.file.readJSON('setting.json');

	grunt.initConfig({
		rsync: {
			dev: {
				options: {
					src: './repo/www-dev/',
					dest: '<%= setting.dev.dest %>',
					host: '<%= setting.dev.host %>',
					recursive: true,
					compareMode: 'checksum',
					syncDesujtIgnoreExcl: true,
					dryRun: false,
					exclude:[],
					args: ['--delete']
				}
			},
			prd: {
				options: {
					src: './repo/www-prd/',
					dest: '<%= setting.prd.dest %>',
					host: '<%= setting.prd.host %>',
					recursive: true,
					compareMode: 'checksum',
					syncDesujtIgnoreExcl: true,
					dryRun: false,
					exclude:[],
					args: ['--delete']
				}
			},
		},
	});
	grunt.registerTask('git', function() {
		var done = this.async();
		var command = 'cd repo; git pull;';
		var child = exec(command, function(err, stdout, stderr) {
			if (!err) {
				if (stdout.match(/Already up-to-date./g)) {
					done(false);
				} else {
					done(true);
				}
			} else {
				done(false);
			}
		});
	});
	grunt.registerTask('build', function(type) {
		var done = this.async();
		var command = 'cd repo; grunt ' + type + ';';
		var child = exec(command, function(err, stdout, stderr) {
			var filename = 'log/' + type + '_' + moment().format('YYYY-MM-DD HH-mm-ss');
			var log = '';

			if (!err) {
				log = stdout;
				grunt.file.write(filename, log);
			} else {
				log += err.code + "\n";
				log += err.signal + "\n";
				log += stderr + "\n";
				grunt.file.write(filename, log);
			}
			done(true);
		});
	});
	for (var taskName in pkg.devDependencies) {
		if  (taskName.substring(0, 6) === 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}
	grunt.registerTask('deploy', ['git', 'build:dev', 'rsync:dev', 'build:prd', 'rsync:prd']);
};
