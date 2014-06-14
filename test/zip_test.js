// Load in dependencies
var _ = require('underscore.string');
var expect = require('chai').expectlite;
var fsUtils = require('./utils/fs');
var gruntUtils = require('./utils/grunt');

// Begin our tests
describe('A grunt `zip` task', function () {
  describe('zipping a single file', function () {
    gruntUtils.runTask('zip:single');
    fsUtils.loadFiles('single_zip/file.zip');

    it('matches the expected output', function () {
      // Calculate how many bits are off and under our threshold
      var difference = _.levenshtein(this.expectedFile, this.actualFile);
      expect(difference).to.be.at.most(50);
    });
  });

  describe('zipping multiple file', function () {
    gruntUtils.runTask('zip:multi');
    fsUtils.loadFiles('single_zip/file.zip');

    it('matches the expected output', function () {
      // Calculate how many bits are off and under our threshold
      var difference = _.levenshtein(this.expectedFile, this.actualFile);
      expect(difference).to.be.at.most(50);
    });
  });
});

exports.hai = {
  'multiZip': function (test) {
    // Set up
    test.expect(1);
    addMethods(test);


    // zip:multi
    // Assert single_zip is close enough and return
    test.closeFiles('multi_zip/file.zip', 50);
    test.done();
  },
  'singleUnzip': function (test) {
    // Add in test methods
    test.expect(2);
    addMethods(test);

    // unzip:single
    // Compare a and b
    test.equalFiles('single_unzip/a.js');
    test.equalFiles('single_unzip/b.js');

    // Return
    test.done();
  },
  'nestedUnzip': function (test) {
    test.expect(8);
    addMethods(test);

    // unzip:nested

    // Compare all nested unzip files
    test.equalFiles('nested_unzip/bootstrap/css/bootstrap-responsive.css');
    test.equalFiles('nested_unzip/bootstrap/css/bootstrap-responsive.min.css');
    test.equalFiles('nested_unzip/bootstrap/css/bootstrap.css');
    test.equalFiles('nested_unzip/bootstrap/css/bootstrap.min.css');
    test.equalFiles('nested_unzip/bootstrap/img/glyphicons-halflings-white.png');
    test.equalFiles('nested_unzip/bootstrap/img/glyphicons-halflings.png');
    test.equalFiles('nested_unzip/bootstrap/js/bootstrap.js');
    test.equalFiles('nested_unzip/bootstrap/js/bootstrap.min.js');

    test.done();
  },
  'image': function (test) {
    // Set up
    test.expect(1);
    addMethods(test);

    // zip:image
    // unzip:image

    // Assert the image is the same as when it went in
    test.equalFiles('image_zip/unzip/test_files/smile.gif');
    test.done();
  },
  'nestedZip': function (test) {
    // Set up
    test.expect(5);
    addMethods(test);

    // zip:nested
    // unzip:nested

    // Assert all files are the same as they went in
    test.equalFiles('nested_zip/unzip/test_files/nested/hello.js');
    test.equalFiles('nested_zip/unzip/test_files/nested/world.txt');
    test.equalFiles('nested_zip/unzip/test_files/nested/glyphicons-halflings.png');
    test.equalFiles('nested_zip/unzip/test_files/nested/nested2/hello10.txt');
    test.equalFiles('nested_zip/unzip/test_files/nested/nested2/hello20.js');

    // Return
    test.done();
  },
  'routerZip': function (test) {
    // Set up
    test.expect(2);
    addMethods(test);

    // zip:router
    // unzip:router

    // Assert all files are the same as they went in
    test.equalFiles('router_zip/unzip/hello.js');
    test.equalFiles('router_zip/unzip/hello10.txt');

    // Return
    test.done();
  },
  'routerUnzip': function (test) {
    test.expect(8);
    addMethods(test);

    // unzip:router

    // Compare all router unzip files
    test.equalFiles('router_unzip/bootstrap-responsive.css');
    test.equalFiles('router_unzip/bootstrap-responsive.min.css');
    test.equalFiles('router_unzip/bootstrap.css');
    test.equalFiles('router_unzip/bootstrap.min.css');
    test.equalFiles('router_unzip/glyphicons-halflings-white.png');
    test.equalFiles('router_unzip/glyphicons-halflings.png');
    test.equalFiles('router_unzip/bootstrap.js');
    test.equalFiles('router_unzip/bootstrap.min.js');

    test.done();
  },
  'cwdZip': function (test) {
    // Set up
    test.expect(2);
    addMethods(test);

    // Assert all files are the same as they went in
    test.equalFiles('cwd_zip/unzip/hello.js');
    test.equalFiles('cwd_zip/unzip/nested2/hello10.txt');

    // Return
    test.done();
  },
  'dotZip': function (test) {
    // Set up
    test.expect(2);
    addMethods(test);

    // Assert all files are the same as they went in
    test.equalFiles('dot_zip/unzip/test_files/dot/.test/hello.js');
    test.equalFiles('dot_zip/unzip/test_files/dot/test/.examplerc');

    // Return
    test.done();
  },
  'skipFilesZip': function (test) {
    // Set up
    test.expect(2);
    addMethods(test);

    // Assert all files are the same as they went in
    test.equalFiles('skip_files_zip/unzip/test_files/nested/hello.js');
    test.noFile('skip_files_zip/unzip/test_files/nested/nested2/hello10.txt');

    // Return
    test.done();
  },
  'skipFilesUnzip': function (test) {
    test.expect(8);
    addMethods(test);

    // Assert CSS files do not exist
    test.noFile('skip_files_unzip/bootstrap/css/bootstrap-responsive.css');
    test.noFile('skip_files_unzip/bootstrap/css/bootstrap-responsive.min.css');
    test.noFile('skip_files_unzip/bootstrap/css/bootstrap.css');
    test.noFile('skip_files_unzip/bootstrap/css/bootstrap.min.css');

    // Assert other files do exist
    test.equalFiles('skip_files_unzip/bootstrap/img/glyphicons-halflings-white.png');
    test.equalFiles('skip_files_unzip/bootstrap/img/glyphicons-halflings.png');
    test.equalFiles('skip_files_unzip/bootstrap/js/bootstrap.js');
    test.equalFiles('skip_files_unzip/bootstrap/js/bootstrap.min.js');

    test.done();
  },
  'emptyUnzip': function (test) {
    var stats = fs.statSync('actual/empty/double_empty');
    test.strictEqual(stats.isDirectory(), true);
    test.done();
  }
};

// TODO: Figure out how to test this only for grunt@0.4
var fs = require('fs');
// 0.4 specific test for twolfson/grunt-zip#6
exports['0.4'] = {
  'dest-template': function (test) {
    test.expect(2);

    // Grab the stats on the file
    var file = __dirname + '/actual/template_zip/grunt-zip.zip';
    fs.stat(file, function (err, stat) {
      // Assert there is no error
      test.equal(err, null, 'There was no error during `stat`');

      // and we are looking at a file
      test.ok(stat.isFile, 'The templated zip file was not successfully created');

      // Callback
      test.done();
    });
  }
};
