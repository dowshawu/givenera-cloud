Parse.Cloud.define("emojPost", function (request, response) {
	'use strict';

	var Emoj = Parse.Object.extend("Emotion");

	Parse.Cloud.run("hasEmoj", { post: request.params.post, user: request.user.id }, {
		success: function(result) {
			if( !result ) {

				var emoj = new Emoj();
				emoj.set("user", request.user);
				emoj.set("post", {
					__type: "Pointer",
					className: "Posts",
					objectId: request.params.post
				});
				emoj.set("type", request.params.type);
				
				emoj.save()
				.then( function (result) {
					response.success(result);
				}, function (error) {
					response.error("failed to give an emoj!");
				});
			} else {
				response.error("already emoj the post");
			}
		},

		error: function (error) {
			response.error(error);
		}
	})

});

Parse.Cloud.define("unemojPost", function (request, response) {
	'use strict';

	var emoj = new Parse.Query("Emotion");
	emoj.equalTo("user", request.user);
	emoj.equalTo("post", {
		__type: "Pointer",
		className: "Posts",
		objectId: request.params.post
	});
		
	emoj.find().then( function (result) {
		return result[0].destroy();
	}).then( function (result) {
		response.success(result);
	}, function (error) {
		response.error("failed to unemoj!");
	});
});

Parse.Cloud.define("hasEmoj", function (request, response) {
	'use strict';

	var query = new Parse.Query("Emotion");

	if ( request.params.user ) {
		query.equalTo("user", {
			__type: "Pointer",
			className: "_User",
			objectId: request.params.user
		});
	} else {
		query.equalTo("user", request.user);	
	}
	query.equalTo("post", {
			__type: "Pointer",
			className: "Posts",
			objectId: request.params.post
	});
	query.count().then(function (result) {
		if ( result === 1 ) {
			response.success(true);
		} else if ( result === 0 ) {
			response.success(false);
		} else {
			response.error("over 1");
		}
	}, function (error) {
		response.error("Function hasEmoj error");
	});
});

Parse.Cloud.define("countEmoj", function (request, response) {
	'use strict';

	var query = new Parse.Query("Emotion");

	query.equalTo("post", {
			__type: "Pointer",
			className: "Posts",
			objectId: request.params.post
	});
	query.count().then(function (result) {
		response.success(result);
	}, function (error) {
		response.error("Function hasEmoj error");
	});
});


