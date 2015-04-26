Parse.Cloud.define("getPostByUser", function (request, response) {
	'use strict';

	var query = new Parse.Query("Posts");
	query.equalTo("postBy", request.user);
	query.equalTo("Status", "confirmed");
	query.include("postBy");
	query.include("postTo");
	query.descending("updatedAt");
	query.find({
	    success: function(results) {
			response.success(results);
	    },
	    error: function() {
	      response.error("get PostBy function failed");
	    }
	});

});

Parse.Cloud.define("getPostToUser", function (request, response) {
	'use strict';

	var query = new Parse.Query("Posts");
	query.equalTo("postTo", request.user);
	query.equalTo("Status", "confirmed");
	query.include("postBy");
	query.include("postTo");
	query.descending("updatedAt");
	query.find({
	    success: function(results) {
			response.success(results);
	    },
	    error: function() {
	      response.error("get PostTo function failed");
	    }
	});

});

Parse.Cloud.define("getDailyBread", function (request, response) {
	'use strict';
	var username = request.user.get("username");
	var user1 = new Parse.Query("Relationship");
	user1.equalTo("user_one", username);
	user1.equalTo("Status", "confirmed");
	var user2 = new Parse.Query("Relationship");
	user2.equalTo("user_two", username);
	user2.equalTo("Status", "confirmed");
	var friendList = new Parse.Query.or(user1,user2);

	friendList.find({
	    error: function() {
	      response.error("get PostTo function failed");
	    }
	}).then(function(friends) {
		var friendList = [];
		for( var i=0 ; i<friends.length ; ++i ) {
			var target;
			if( friends[i].get("user_one")===request.user.get("username") ) {
				target = friends[i].get("user_two");
			} else {
				target = friends[i].get("user_one");
			}
			friendList.push(target);
		}
		friendList.push(request.user.get("username"));
		return friendList	
	}).then(function(friendList) {
		var friends = new Parse.Query("_User");
		friends.containedIn("username", friendList);
		return friends.find();
	}).then(function(friends) {
		var queryTo = new Parse.Query("Posts");
		// queryTo.equalTo("postTo", request.user);
		queryTo.containedIn("postTo", friends);
		queryTo.equalTo("Status", "confirmed");
		var queryBy = new Parse.Query("Posts");
		// queryBy.equalTo("postBy", request.user);
		queryBy.containedIn("postBy", friends);
		queryBy.equalTo("Status", "confirmed");
		var mainQuery = Parse.Query.or(queryTo, queryBy);
		mainQuery.descending("updatedAt");
		mainQuery.include("postBy","postTo");
		return mainQuery.find();
	}).then(function(results) {
		response.success(results);
	}, function(error) {
  		response.error(error);
	});
});