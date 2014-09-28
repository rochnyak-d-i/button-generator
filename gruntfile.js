module.exports = function(grunt) {
    var
        componentsPath = './dev/components/'
        , uiPath = componentsPath + 'jquery-ui/'
        , uiScriptsPath = uiPath + 'ui/'
        , uiStylePath = uiPath + 'themes/base/'
        , jqCpPath = componentsPath + 'jquery.colorpicker/'
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
                    , uiScriptsPath + 'position.js'
                    , uiScriptsPath + 'draggable.js'
                    , uiScriptsPath + 'resizable.js'
                    , uiScriptsPath + 'button.js'
                    , uiScriptsPath + 'dialog.js'
                    , uiScriptsPath + 'tooltip.js'
                    , uiScriptsPath + 'slider.js'
                    , jqCpPath + 'jquery.colorpicker.js'
                    , './dev/js/custom.js'
                    , './dev/js/option.js'
                    , './dev/js/viewOption.js'
                    , './dev/js/options.js'
                    , './dev/js/main.js'
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
                    , uiStylePath + 'core.css'
                    , uiStylePath + 'theme.css'
                    , uiStylePath + 'draggable.css'
                    , uiStylePath + 'resizable.css'
                    , uiStylePath + 'button.css'
                    , uiStylePath + 'dialog.css'
                    , uiStylePath + 'slider.css'
                    , uiStylePath + 'tooltip.css'
                    , jqCpPath + 'jquery.colorpicker.css'
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
            },
            jqCpImages: {
                expand: true,
                cwd: jqCpPath + 'images/',
                src: '**',
                dest: './public/css/images/'
            },
            fonts: {
                flatten: true,
                filter: 'isFile',
                expand: true,
                cwd: './dev/fonts/',
                src: '**',
                dest: './public/css/fonts/'
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