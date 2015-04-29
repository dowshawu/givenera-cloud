require('cloud/relationship/relationship.js');
require('cloud/post/getPost.js');
require('cloud/post/photo-resize.js');
require('cloud/search-user.js');
require('cloud/user/profile-photo.js');
require('cloud/postAutoIncrement.js');
require('cloud/friend/getFriendList.js');
require('cloud/map/getStatesHelpData.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function (request, response) {
  response.success("Hello world!");
});