/*global module, require*/

module.exports = function (grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp'
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/**/*'
          ]
        }]
      }
    },

    // A multi-task to validate your JavaScript files with JSLint.
    jslint: {
      scripts: {
        src: ['<%= config.src %>/no-dblclick.js'],
        directives: {
          predef: ['angular','document','window','console'],
          white: true,
          regexp: true,
          newcap: true,
          todo: true
        }
      }
    },

    removelogging: {
      dist: {
        src: "<%= config.src %>/no-dblclick.js",
        dest: "<%= config.dist %>/no-dblclick.js"
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          src: '<%= config.dist %>/no-dblclick.js',
          dest: ''
        }]
      }
    },

    // Minify files with UglifyJS.
    uglify: {
      build: {
        files: {
          '<%= config.dist %>/no-dblclick.min.js': ['<%= config.dist %>/no-dblclick.js']
        }
      }
    }

  });

  grunt.registerTask('build', [
    'clean',
    'jslint',
    'removelogging',
    'ngAnnotate',
    'uglify'
  ]);

};
