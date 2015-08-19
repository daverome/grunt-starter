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
    // Images
    //************************************************************
    imagemin: {
      dynamic: {
        files: [{
          expand: true,                             // Enable dynamic expansion
          cwd: '<%= pkg.srcDir %>images/',          // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],              // Actual patterns to match
          dest: '<%= pkg.destDir %>assets/img/'  // Destination path prefix
        }]
      }
    },

    //************************************************************
    // MISC
    //************************************************************
    webfont: {
      icons: {
        src: '<%= pkg.srcDir %>svg/**/*.svg',
        dest: '<%= pkg.destDir %>assets/fonts/icons',
        destCss: '<%= pkg.srcDir %>sass/generated',
        options: {
          font: 'icons',
          htmlDemo: false,
          relativeFontPath: '../fonts/icons',
          stylesheet: 'scss',
          syntax: 'bootstrap'
        }
      }
    },

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
      },
      img: {
        files: '<%= pkg.srcDir %>images/**/*.{png,jpg,gif}',
        tasks: ['images']
      },
      icons: {
        files: '<%= pkg.srcDir %>svg/**/*.svg',
        tasks: ['webfont']
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

  grunt.registerTask('images', ['imagemin']);
};
