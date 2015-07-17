var _ = require("underscore");

Parse.Cloud.define("getDailyBreadTest", function (request, response) {
	// TODO : put the output file.
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
		mainQuery.include("postBy","postTo","sharePost");
		return mainQuery.find();
	}).then( function (results) {
		var resultsJson = [];
		_.each(results, function (obj) {
			var objJson;
			if ( obj.has("sharePost")) {
				objJson = obj.get("sharePost").toJSON();
				objJson.isShare = true;
				objJson.shareId = obj.id;
				objJson.shareBy = obj.get("postBy");
				// TODO : the emotions here hasn't been synchronized to the original post. Need to decide whether use different emojShare function for purpose. 
			} else {
				objJson = obj.toJSON();
				objJson.isShare = false;
			}
			resultsJson.push(objJson);
		});
		response.success(resultsJson);
	}, function(error) {
  		response.error(error);
	});
});