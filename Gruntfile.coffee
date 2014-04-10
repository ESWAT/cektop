module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    concurrent:
      dev: [
        "jade:dev"
        "stylus:dev"
        "coffee:dev"
        "copy"
      ]
      release: [
        "jade:release"
        "stylus:release"
        "coffee:release"
        "copy"
      ]
      optimize: [
        "uglify"
        "newer:imagemin"
      ]

    "gh-pages":
      options:
        base: "release"

      src: ["**/*"]

    connect:
      options:
        base: ["release"]
      dev:
        options:
          keepalive: false
      release:
        options:
          keepalive: true

    clean:
      dev: ["release"]
      release: ["release",]
      tmp: [ "release/tmp"]

    coffee:
      dev:
        files:
          "release/js/app.js": ["src/script/*.coffee"]
        options:
          sourceMap: true

      release:
        files:
          "release/tmp/app.js": ["src/script/*.coffee"]

    coffeelint:
      app: ['src/script/*.coffee']

    copy:
      js:
        files: [
          expand: true
          flatten: true
          src: ["src/script/*.js"]
          dest: "release/js/"
        ]

      assets:
        files: [
          expand: true
          flatten: true
          src: ["src/assets/**/*"]
          dest: "release/assets/"
        ]

    imagemin:
      release:
        files: [
          expand: true
          flatten: true
          src: ["src/assets/**/*.{png,jpg,gif}"]
          dest: "release/assets/"
        ]

    jade:
      options:
        data:
          title: "<%= pkg.name %>"
          author: "<%= pkg.author %>"
          description: "<%= pkg.description %>"
          version: "<%= pkg.version %>"

      dev:
        files: [
          expand: true
          cwd: "src"
          src: ["*.jade"]
          dest: "release"
          ext: ".html"
        ]
        options:
          pretty: true

      release:
        files: [
          expand: true
          cwd: "src"
          src: ["*.jade"]
          dest: "release"
          ext: ".html"
        ]

    stylus:
      dev:
        files: [
          expand: true
          cwd: "src/stylus"
          src: ["*.styl"]
          dest: "release/css"
          ext: ".css"
        ]
        options:
          linenos: true
          compress: false

      release:
        files: [
          expand: true
          cwd: "src/stylus"
          src: ["*.styl"]
          dest: "release/css"
          ext: ".css"
        ]

    uglify:
      release:
        files: [
          expand: true
          cwd: "release/tmp"
          src: ["*.js"]
          dest: "release/js"
          ext: ".js"
        ]

    watch:
      jade:
        files: ["src/**/*.jade"]
        tasks: ["newer:jade:dev"]

      stylus:
        files: ["src/stylus/*.styl"]
        tasks: ["stylus:dev"]

      coffee:
        files: ["src/script/*.coffee"]
        tasks: ["newer:coffee:dev"]

      js:
        files: ["src/script/*.js"]
        tasks: ["newer:copy:script"]

      assets:
        files: ["src/assets/**/*"]
        tasks: ["newer:copy:assets"]

      grunt:
        files: ["Gruntfile.coffee", "package.json"]
        tasks: ["concurrent:dev"]

      options:
        spawn: false
        livereload: true

  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-concurrent"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-gh-pages"
  grunt.loadNpmTasks "grunt-newer"
  grunt.loadNpmTasks "grunt-contrib-imagemin"

  grunt.registerTask "default", [
    "coffeelint"
    "clean"
    "concurrent:dev"
    "connect:dev"
    "watch"
  ]
  grunt.registerTask "prod", [
    "clean:release"
    "clean:tmp"
    "concurrent:release"
    "concurrent:optimize"
    "clean:tmp"
    "connect:release"
  ]
  grunt.registerTask "build", [
    "clean:release"
    "clean:tmp"
    "concurrent:release"
    "concurrent:optimize"
    "clean:tmp"
  ]
  grunt.registerTask "shipit", [
    "clean:release"
    "clean:tmp"
    "concurrent:release"
    "concurrent:optimize"
    "clean:tmp"
    "gh-pages"
  ]
