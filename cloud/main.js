require('cloud/getPost.js');
require('cloud/photo-resize.js');
require('cloud/search-user.js');
require('cloud/profile-photo.js');
require('cloud/postAutoIncrement.js');
require('cloud/getFriendList.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function (request, response) {
  response.success("Hello world!");
});