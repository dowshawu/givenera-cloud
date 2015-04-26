Parse.Cloud.define("getFriendList", function(request, response) {
    'use strict';
    var username = request.user.get("username");
    var user1 = new Parse.Query("Relationship");
    user1.equalTo("user_one", username);
    user1.containedIn("Status", ["confirmed", "pending"]);
    var user2 = new Parse.Query("Relationship");
    user2.equalTo("user_two", username);
    user2.containedIn("Status", ["confirmed", "pending"]);
    var mainQuery = new Parse.Query.or(user1,user2);
     
    mainQuery.find().then(function(friends){
        var friendList = [];
        for(var i=0; i<friends.length; i++){
            if(friends[i].get("user_one")===username){
                friendList.push(friends[i].get("user_two"));
            }
            else{
                friendList.push(friends[i].get("user_one"));
            }
        }
        return friendList;
    }).then(function(friendList) {
        var userListQuery = new Parse.Query("_User");
        userListQuery.containedIn("username",friendList);
        return userListQuery.find();
    }).then(function(results) {
    	response.success(results);
    }, function(error) {
    	response.error("friendList Lookup failed");
    });
});

Parse.Cloud.define("getConfirmedFriendList", function(request, response) {
    'use strict';
    var username = request.user.get("username");
    var user1 = new Parse.Query("Relationship");
    user1.equalTo("user_one", username);
    user1.equalTo("Status", "confirmed");
    var user2 = new Parse.Query("Relationship");
    user2.equalTo("user_two", username);
    user2.equalTo("Status", "confirmed");
    var friendListQuery = new Parse.Query.or(user1,user2);
     
    friendListQuery.find().then(function(friends){
        var friendList = [];
        for(var i=0; i<friends.length; i++){
            if(friends[i].get("user_one")===username){
                friendList.push(friends[i].get("user_two"));
            }
            else{
                friendList.push(friends[i].get("user_one"));
            }
        }
        return friendList;
    }).then(function(friendList){
        var userListQuery = new Parse.Query("_User");
        userListQuery.containedIn("username",friendList);
        userListQuery.find({
            success:function(results){
                response.success(results);
            },
            error:function() {
                response.error("friendList Lookup failed");
            }
        });
    });
});

Parse.Cloud.define("getPendingFriendList", function(request, response) {
    'use strict';
    var username = request.user.get("username");
    var user1 = new Parse.Query("Relationship");
    user1.equalTo("user_one", username);
    user1.equalTo("Status", "pending");
    var user2 = new Parse.Query("Relationship");
    user2.equalTo("user_two", username);
    user2.equalTo("Status", "pending");
    var friendListQuery = new Parse.Query.or(user1,user2);
     
    friendListQuery.find().then(function(friends){
        var friendList = [];
        for(var i=0; i<friends.length; i++){
            if(friends[i].get("user_one")===username){
                friendList.push(friends[i].get("user_two"));
            }
            else{
                friendList.push(friends[i].get("user_one"));
            }
        }
        return friendList;
    }).then(function(friendList){
        var userListQuery = new Parse.Query("_User");
        userListQuery.containedIn("username",friendList);
        userListQuery.find({
            success:function(results){
                response.success(results);
            },
            error:function() {
                response.error("friendList Lookup failed");
            }
        });
    });
});

