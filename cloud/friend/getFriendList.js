Parse.Cloud.define("getFriendList", function(request, response) {
    'use strict';
    var user1 = new Parse.Query("Relationship");
    user1.equalTo("userOne", request.user);
    user1.containedIn("Status", ["confirmed", "pending"]);
    var user2 = new Parse.Query("Relationship");
    user2.equalTo("userTwo", request.user);
    user2.containedIn("Status", ["confirmed", "pending"]);
    var mainQuery = new Parse.Query.or(user1,user2);
    mainQuery.include("userOne");
    mainQuery.include("userTwo");
     
    mainQuery.find().then(function(friends) {
        var friendList = [];
        for(var i=0; i<friends.length; ++i) {
            if(friends[i].get("userOne")===request.user) {
                friendList.push({"status": friends[i].get("Status"), "friend": friends[i].get("userTwo")});
            }
            else{
                friendList.push({"status": friends[i].get("Status"), "friend": friends[i].get("userOne")});
            }
        }
        response.success(friendList);
    }, function(error) {
    	response.error("friendList Lookup failed");
    });
});

Parse.Cloud.define("getConfirmedFriendList", function(request, response) {
    'use strict';
    var username = request.user.get("username");
    var user1 = new Parse.Query("Relationship");
    user1.equalTo("userOne", request.user);
    user1.equalTo("Status", "confirmed");
    var user2 = new Parse.Query("Relationship");
    user2.equalTo("userTwo", request.user);
    user2.equalTo("Status", "confirmed");
    var friendListQuery = new Parse.Query.or(user1,user2);
    friendListQuery.include("userOne");
    friendListQuery.include("userTwo");
     
    friendListQuery.find().then(function(friends){
        var friendList = [];
        for(var i=0; i<friends.length; i++){
            if(friends[i].get("userOne")===request.user) {
                friendList.push(friends[i].get("userTwo"));
            }
            else {
                friendList.push(friends[i].get("userOne"));
            }
        }
        response.success(friendList);
    }, function(error) {
        response.error("Confirmed friendList Lookup failed");
    });
});

Parse.Cloud.define("getPendingFriendList", function(request, response) {
    'use strict';
    var username = request.user.get("username");
    var user1 = new Parse.Query("Relationship");
    user1.equalTo("userOne", request.user);
    user1.equalTo("Status", "pending");
    var user2 = new Parse.Query("Relationship");
    user2.equalTo("userTwo", request.user);
    user2.equalTo("Status", "pending");
    var friendListQuery = new Parse.Query.or(user1,user2);
    friendListQuery.include("userOne");
    friendListQuery.include("userTwo");
     
    friendListQuery.find().then(function(friends) {
        var friendList = [];
        for(var i=0; i<friends.length; ++i) {
            if(friends[i].get("userOne")===request.user) {
                friendList.push(friends[i].get("userTwo"));
            }
            else {
                friendList.push(friends[i].get("userOne"));
            }
        }
        response.success(friendList);
    }, function(error) {
        response.error("Pending friendList Lookup failed");
    });
});

