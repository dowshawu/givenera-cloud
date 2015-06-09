Parse.Cloud.define("getDailyBread1", function (request, response) {
	'use strict';

	var user1 = new Parse.Query("Relationship");
	user1.equalTo("userOne", request.user);
	user1.equalTo("Status", "confirmed");
	var user2 = new Parse.Query("Relationship");
	user2.equalTo("userTwo", request.user);
	user2.equalTo("Status", "confirmed");
	var friendList = new Parse.Query.or(user1,user2);
	friendList.include("userOne");
	friendList.include("userTwo");

	friendList.find({
	    error: function() {
	      response.error("get PostTo function failed");
	    }
	}).then(function(friends) {
		var friendList = [];
		for( var i=0 ; i<friends.length ; ++i ) {
			var target;
			if( friends[i].get("userOne")===request.user ) {
				target = friends[i].get("userTwo");
			} else {
				target = friends[i].get("userOne");
			}
			friendList.push(target);
		}
		friendList.push(request.user);
		return friendList	
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
		return [friends, mainQuery.find()];
	}).then(function(friends, results) {
		response.success(results);
	}, function(error) {
  		response.error(error);
	});
});