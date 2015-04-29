var Image = require("parse-image");

Parse.Cloud.beforeSave("Relationship", function(request, response) {
  'use strict';
  var relationship = request.object;
  if (!relationship.get("userOne")) {

    var user_one = relationship.get('user_one');
    var user_two = relationship.get('user_two');
    var active_user = relationship.get('active_user');
    var query_user_one = Parse.Query("_User");
    query_user_one.equalTo("username", user_one);
    query_user_one.find().then(function(result) {
      relationship.set("userOne", result[0]);
    }).then(function(result) {
      var query_user_two = Parse.Query("_User");
      query_user_two.equalTo("username", user_two);
      return query_user_two.find();
    }).then(function(result) {
      relationship.set("userTwo", result[0]);
    }).then(function(result) {
      var query_active_user = Parse.Query("_User");
      query_active_user.equalTo("username", active_user);
      return query_active_user.find();
    }).then(function(result) {
      relationship.set("activeUser", result[0]);
    }).then(function(result) {
      response.success();
    }, function(error) {
      response.error(error);
    });

});