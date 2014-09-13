module.exports = function(grunt) {
	var
		uiThemeName = 'start'
		, uiPath = './dev/components/jquery-ui/'
		, uiScriptsPath = uiPath + 'ui/'
		, uiStylePath = uiPath + 'themes/' + uiThemeName + '/'
	;

	grunt.initConfig({
		concat: {
			options: {
				separator: ';\n',
				stripBanners: true
			},
			dist: {
				src: [
					'./dev/components/jquery/dist/jquery.js'
					, uiScriptsPath + 'core.js'
					, uiScriptsPath + 'widget.js'
					, uiScriptsPath + 'mouse.js'
					, uiScriptsPath + 'slider.js'
					, './dev/js/*.js'
				],
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
				src: [
					'./dev/css/normalize.css'
					, './dev/css/main.css'
				],
				dest: './public/css/main.min.css'
			}
		},

		copy: {
			theme_imgs: {
				flatten: true,
				filter: 'isFile',
				expand: true,
				cwd: uiStylePath + 'images/',
				src: '**',
				dest: './public/css/images/'
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
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);
}