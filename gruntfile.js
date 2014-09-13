module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: ';\n',
				stripBanners: true
			},
			dist: {
				src: './dev/js/*.js',
				dest: './public/js/main.js'
			}
		},
		
		uglify: {
			dist: {
				src: './public/js/main.js',
				dest: './public/js/main.min.js'
			}
		},

		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			dist: {
				src: './dev/css/*.css',
				dest: './public/css/main.min.css'
			}
		},

		watch: {
			scripts: {
				files: './dev/js/*.js',
				tasks: ['concat', 'uglify']
			},
			styles: {
				files: './dev/css/*.css',
				tasks: ['cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
}