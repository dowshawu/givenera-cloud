Parse.Cloud.define("sharePost", function (request, response) {
	'use strict';

	var Share = Parse.Object.extend("Share");

	var post = new Parse.Query("Posts");
	post.equalTo("objectId", request.params.post);
	post.find({
		error: function (error) {
			response.error("Post objectId doesn't exit");
		}
	}).then(function (result) {
		var share = new Share();
		share.set("user",request.user);
		share.set("post",result[0]);
		
		return share.save()
	}).then( function (result) {
		response.success(result);
	}, function (error) {
		response.error("failed to save Share object!")
	});
});