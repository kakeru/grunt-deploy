var exclude = [
	'!**/.DS_Store',
	'!**/Thumbs.db',
	'!**/*.ect',
	'!**/*.scss',
	'!**/*.less',
	'!**/*.ts',
	'!**/*.fla'
];
module.exports = function(grunt) {
	pkg = grunt.file.readJSON('package.json');
	grunt.initConfig({
		copy : {
			dev : {
				expand : true,
				filter: 'isFile',
				cwd : 'src/',
				src : ['**'].concat(exclude),
				dest : 'www-dev/',
			},
			prd : {
				expand : true,
				filter: 'isFile',
				cwd : 'src/',
				src : ['**'].concat(exclude),
				dest : 'www-prd/',
			},
		},
	});
	for (var taskName in pkg.devDependencies) {
		if  (taskName.substring(0, 6) === 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}
	grunt.registerTask('dev', [
		'copy:dev',
	]);
	grunt.registerTask('prd', [
		'copy:prd',
	]);
};