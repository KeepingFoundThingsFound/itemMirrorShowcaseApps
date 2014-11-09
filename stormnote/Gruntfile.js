'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    server: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    
        // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '*.html',
          '*.css',
          '*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    
        // The actual grunt server settings
    connect: {
      options: {
        port: 137,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729,
        base: '/Github/itemMirrorShowcaseApps/stormnote/'
      },
      livereload: {
        options: {
          open: true
        }
      },
      test: {
        options: {
          port: 9001
        }
      },
      dist: {
      }
    }
  });


  
  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
    grunt.registerTask('serve', function (target) {
      
    grunt.task.run([
      'connect:livereload',
      'watch'
    ]);
    
  });

};