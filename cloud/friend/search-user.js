Parse.Cloud.define("searchUser", function (request, response) {
	'use strict';

	var query = new Parse.Query("_User");
	query.contains("username", request.params.string);
	query.find({
	    success: function(results) {
			var data = [];
			for (var i = 0; i < results.length; ++i) {
				data.push(rows[i].first_name);
			}
			response.success(JSON.stringify(data));
	    },
	    error: function() {
	      response.error("lookup failed");
	    }
	});

});

Parse.Cloud.define("getAddUser", function (request, response) {
	'use strict';

	var query1 = new Parse.Query("_User");
	query1.equalTo("username", request.params.token);
	var query2 = new Parse.Query("_User");
	query2.equalTo("email", request.params.token);
	var mainQuery = new Parse.Query.or(query1,query2);

	mainQuery.find({
	    success: function(results) {
			response.success(results);
	    },
	    error: function() {
	      response.error("No user found");
	    }
	});

});


