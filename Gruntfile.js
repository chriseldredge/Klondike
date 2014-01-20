// Generated on 2013-12-05 using generator-webapp 0.4.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // configurable paths
        yeoman: {
            app: 'app',
            build: '.tmp',
            dist: 'dist'
        },
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:serve', 'autoprefixer']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            preprocess: {
                files: ['<%= yeoman.app %>/*.html'],
                tasks: ['preprocess:serve']
            },
            emberTemplates: {
                files: '<%= yeoman.app %>/templates/**/*.{hbs,hjs,handlebars}',
                tasks: ['emberTemplates']
            },
            transpile: {
                files: ['<%= yeoman.app %>/js/**/*.js', '!<%= yeoman.app %>/js/loader.js'],
                tasks: ['transpile', 'concat']
            },
            copy: {
                files: ['<%= yeoman.app %>/bin/*', '<%= yeoman.app %>/Web.config', '<%= yeoman.app %>/Global.asax'],
                tasks: ['copy:serve']
            },
            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    '<%= yeoman.build %>/*.html',
                    '<%= yeoman.build %>/styles/{,*/}*.css',
                    '<%= yeoman.build %>/js/**/*.js',
                    '<%= yeoman.build %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= yeoman.build %>',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '<%= yeoman.build %>',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>',
                }
            }
        },
        iisexpress: {
            options: {
                port: 9000,
                open: true,
                killOn: 'SIGINT'
            },
            dist: {
                options: {
                    path: '<%= yeoman.dist %>'
                }
            },
            livereload: {
                options: {
                    path: '<%= yeoman.build %>',
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.build %>',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            serve: '<%= yeoman.build %>'
        },
        'git-describe': {
            default: {
                options: {
                    template: '<%= pkg.version %> ({%=object%}{%=dirty%})'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/js/{,*/}*.js',
                '!<%= yeoman.app %>/js/loader.js',
                '!<%= yeoman.app %>/js/formtemplate.min.js',
                '!<%= yeoman.app %>/js/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '<%= yeoman.build %>/styles',
                generatedImagesDir: '<%= yeoman.build %>/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/js',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.build %>/vendor',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                }
            },
            serve: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.build %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= yeoman.build %>/styles/'
                }]
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/js/**/*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        '!<%= yeoman.dist %>/images/package-default-icon-50x50.png',
                        '!<%= yeoman.dist %>/js/formtemplate.min.js',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.dist %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*',
                        'vendor/sass-bootstrap/fonts/*.*',
                        'js/formtemplate.min.js',
                        'Global.asax',
                        'bin/*'
                    ]
                }]
            },
            serve: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.build %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**/*',
                        'styles/fonts/{,*/}*.*',
                        'js/loader.js',
                        'js/formtemplate.min.js',
                        'vendor/**/*',
                        'Global.asax',
                        'bin/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '<%= yeoman.build %>/styles/',
                src: '{,*/}*.css'
            },
            nprogress: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.build %>/',
                src: 'vendor/nprogress/nprogress.css',
                rename: function(dest, src) {
                    return dest + src.replace('.css', '.scss');
                }
            }
        },
        concurrent: {
            serve: [
                'compass',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'compass',
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        preprocess: {
            options: {
                context: {
                    ProductVersion: '<%= pkg.versionWithCommit %>'
                }
            },
            serve: {
                options: {
                    context: {
                        DEBUG: true,
                        livereload: '<%= watch.livereload.options.livereload %>'
                    }
                },
                src: '<%= yeoman.app %>/index.html',
                dest: '<%= yeoman.build %>/index.html'
            },
            dist: {
                options: {
                    inline: true
                },
                src : [
                    '<%= yeoman.dist %>/index.html',
                ]
            }
        },
        emberTemplates: {
            compile: {
                options: {
                    templateBasePath: /app\/templates\//
                },
                files: {
                    '<%= yeoman.build %>/js/templates.js': ['<%= yeoman.app %>/templates/**/*.{hbs,hjs,handlebars}']
                }
            }
        },
        transpile: {
            amd: {
                type: 'amd',
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/js/',
                    src: ['**/*.js', '!loader.js', '!formtemplate.min.js'],
                    dest: '<%= yeoman.build %>/amd/',
                    ext: '.amd.js'
                }]
            }
        },
        concat: {
            amd: {
                src: ['<%= yeoman.build %>/amd/**/*.amd.js'],
                dest: '<%= yeoman.build %>/js/amd-combined.js'
            },
        },
        exec: {
            msbuild: {
                cmd: function(target) {
                    target = target || 'serve';

                    var configuration = target === 'dist' ? 'Release' : 'Debug';
                    var distDir = target === 'dist' ? 'dist/' : '.tmp/';

                    var prog = 'c:\\Program Files (x86)\\MSBuild\\12.0\\Bin\\MSBuild.exe';

                    if (!grunt.file.exists(prog)) {
                        grunt.fail.warn('Visual Studio 2013 MSBuild not found at ' + prog);
                    }

                    var args = [
                        prog,
                        '/p:Configuration=' + configuration,
                        '/p:DistDir=' + distDir,
                        '/p:TestsEnabled=False',
                        '/p:VersionPrefix=' + grunt.config.get('pkg.version'),
                        '/p:VersionControlInfo=' + grunt.config.get('pkg.versionWithCommit'),
                    ];

                    return '"' + args.join('" "') + '"';
                }
            }
        }
    });

    grunt.registerTask('serve', function (target, server) {
        var readLine = require ('readline');
        var rl = readLine.createInterface ({
            input: process.stdin,
            output: process.stdout
        });

        rl.on ('SIGINT', function (){
            grunt.log.writeln();
            grunt.log.writeln('Stopping...');
            grunt.event.emit('SIGINT');
            process.exit();
        });

        target = target || 'livereload'; // or dist
        server = server || 'connect'; // or iisexpress
        var serverTarget = server + ':' + target;

        if (target === 'dist') {
            return grunt.task.run(['build', serverTarget, 'wait-forever']);
        }

        grunt.event.once('iisexpress.done', function() {
            grunt.log.writeln();
            grunt.log.writeln('IIS Express exited. Stopping.');
            process.exit();
        });

        grunt.task.run([
            'setVersionWithCommit',
            'clean:serve',
            'copy:serve',
            'copy:nprogress',
            'concurrent:serve',
            'exec:msbuild:serve',
            'autoprefixer',
            'emberTemplates',
            'transpile',
            'concat',
            'preprocess:serve',
            serverTarget,
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:serve',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('setVersionWithCommit', function() {
        grunt.event.once('git-describe', function (rev) {
            grunt.config('pkg.versionWithCommit', rev.toString());

        });
        grunt.task.run('git-describe');
    });

    grunt.registerTask('build', [
        'setVersionWithCommit',
        'clean:dist',
        'copy:serve',
        'copy:nprogress',
        'concurrent:dist',
        'preprocess:dist',
        'useminPrepare',
        'autoprefixer',
        'emberTemplates',
        'transpile',
        'concat',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'copy:dist',
        'exec:msbuild:dist'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
