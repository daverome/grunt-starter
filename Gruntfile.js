module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //************************************************************
    // CSS
    //************************************************************
    sass: {
      dev: {
        options: {
          outputStyle: 'nested'
        },
        files: {
          '<%= pkg.destDir %>assets/css/styles.css': '<%= pkg.srcDir %>sass/styles.scss'
        }
      },
      min: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          '<%= pkg.destDir %>assets/css/styles.min.css': '<%= pkg.srcDir %>sass/styles.scss'
        }
      }
    },

    //************************************************************
    // HTML
    //************************************************************
    jekyll: {
      dev: {
        options: {
          src: '<%= pkg.srcDir %>jekyll',
          dest: '_site'
        }
      }
    },

    prettify: {
      options: {
        condense: false,
        max_preserve_newlines: 2,
        unformatted: ['html', 'pre', 'code']
      },
      all: {
        expand: true,
        cwd: '_site',
        ext: '.html',
        src: ['*.html'],
        dest: '<%= pkg.destDir %>'
      }
    },

    //************************************************************
    // JS
    //************************************************************
    jshint: {
      options: {
        ignores: ['<%= pkg.srcDir %>js/vendor/**/*.js']
      },
      files: ['<%= pkg.srcDir %>js/**/*.js']
    },
    concat: {
      dev: {
        src: ['<%= pkg.srcDir %>js/vendor/**/*.js', '<%= jshint.files %>'],
        dest: '<%= pkg.destDir %>assets/js/app.js',
        separator: ';'
      }
    },

    uglify: {
      dist: {
        src: ['<%= jshint.files %>'],
        dest: '<%= pkg.destDir %>assets/js/app.min.js'
      }
    },

    //************************************************************
    // MISC
    //************************************************************
    watch: {
      options: {
        livereload: true
      },
      jekyll: {
        files: '<%= pkg.srcDir %>jekyll/**/*.html',
        tasks: ['html']
      },
      sass: {
        files: '<%= pkg.srcDir %>sass/**/*.scss',
        tasks: ['styles']
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['js']
      }
    },

    connect: {
      server: {
        options: {
          base: '<%= pkg.destDir %>',
          hostname: '*',
          livereload: true,
          port: 8080
        }
      }
    },

  });

  grunt.registerTask('default', ['connect', 'watch']);

  grunt.registerTask('styles', ['sass']);

  grunt.registerTask('html', ['jekyll', 'prettify']);

  grunt.registerTask('js', ['jshint', 'concat', 'uglify']);


};