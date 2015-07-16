Parse.Cloud.define("sharePost", function (request, response) {
	// input -> post : objectId
	// output -> null
	// NOTE : Does share post support entering text?
	'use strict';

	var Share = Parse.Object.extend("Posts");
	var share = new Share();
	share.set("postBy",request.user);
	share.Set("Status", "confirmed");
	share.set("sharePost", {
		__type: "Pointer",
		className: "Posts",
		objectId: request.params.post
	});
		
	share.save()
	.then( function (result) {
		response.success(result);
	}, function (error) {
		console.error(error);
		response.error("failed to save Share object!");
	});
});

Parse.Cloud.define("deleteSharePost", function (request, response) {
	// input -> share : objectId
	// output -> null
	'use strict';

	var query = new Parse.Query("Posts");
	query.get(request.params.share)
	.then( function (share) {
		if ( share.get('postBy') !== request.user ) {
			response.error("You are not authorized to delete the shared post");
		}
		// TODO: The number of emotion should be decresed while delete the shared post. // NOTE: Can be implemented by afterDelete cloud code.
		return share.destroy()
	}, function (error) {
		console.error(error);
		response.error("failed to delete Share object!");
	});

});