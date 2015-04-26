Parse.Cloud.afterSave("Comment", function(request) {
  'use strict';
  
  var query = new Parse.Query("Posts");
  query.get(request.object.get("post").id, {
    success: function(post) {
      post.increment("comments");
      post.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});