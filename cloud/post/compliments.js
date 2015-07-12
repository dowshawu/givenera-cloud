Parse.Cloud.define("complimentPost", function (request, response) {
	'use strict';

	var Compliment = Parse.Object.extend("Compliment");

	var compliment = new Compliment();
	compliment.set("user",request.user);
	compliment.set("post",{
		__type: "Pointer",
		className: "Posts",
		objectId: request.params.post
	});
	compliment.set("content",request.params.content);
		
	compliment.save()
	.then( function (result) {
		response.success(result);
	}, function (error) {
		response.error("failed to compliment!");
	});
});

Parse.Cloud.define("deleteCompliment", function (request, response) {
	'use strict';

	var query = new Parse.Query("Compliment");
	query.equalTo("objectId", request.params.complimentId);
	query.find({
		error: function (error) {
			response.error("Compliment objectId doesn't exit");
		}
	}).then( function (result) {
		return result[0].destroy();
	}).then( function (result) {
		response.success(result);
	}, function (error) {
		response.error("failed to delete the compliment!");
	});

});

Parse.Cloud.define("getCompliment", function (request, response) {
	'use strict';

	var query = new Parse.Query("Compliment");
	query.equalTo("post", {
		__type: "Pointer",
		className: "Posts",
		objectId: request.params.post
	});
	query.descending("createdAt");
	query.include("user");

	query.find()
	.then( function (result) {
		response.success(result);
	}, function (error) {
		response.error("can't get the compliments for the post!");
	});
});