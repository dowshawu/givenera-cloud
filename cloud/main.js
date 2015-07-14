require('cloud/post/emotions.js');
require('cloud/post/compliments.js');
require('cloud/relationship/relationship.js');
require('cloud/post/getPost.js');
require('cloud/post/posts.js');
require('cloud/search-user.js');
require('cloud/user/profile-photo.js');
require('cloud/postAutoIncrement.js');
require('cloud/friend/getFriendList.js');
require('cloud/map/getStatesHelpData.js');
require('cloud/post/getCategory.js');
require('cloud/post/getPostImage.js');
require('cloud/post/photos-crop.js')
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function (request, response) {
  response.success("Hello world!");
});
