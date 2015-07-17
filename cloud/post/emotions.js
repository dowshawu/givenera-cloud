var _ = require("underscore");

Parse.Cloud.define("emojPost", function (request, response) {
	'use strict';

	var Emoj = Parse.Object.extend("Emotion");

	Parse.Cloud.run("hasEmoj", { post: request.params.post, user: request.user.id }, {
		success: function(result) {
			if( result === -1 ) {

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
	query.find()
	.then(function (result) {
		if ( result.length !== 0 ) {
			if ( result.length > 1 ) {
				response.error("over 1");
			} else {
				response.success(result[0].get("type"));
			}
		} else {
			response.success(-1);
		}
	}, function (error) {
		response.error("Function hasEmoj error");
	});
});

Parse.Cloud.define("countEmoj", function (request, response) {
	// input  -> post : objectId
	// output -> object

	'use strict';

	var query = new Parse.Query("Emotion");

	query.equalTo("post", {
			__type: "Pointer",
			className: "Posts",
			objectId: request.params.post
	});
	query.find().then(function (result) {

		var count = _.countBy(result, function (obj) {
			return obj.get("type");
		})
		_.defaults(count, {0:0, 1:0});

		response.success(count);
	}, function (error) {
		response.error("Function hasEmoj error");
	});
});

Parse.Cloud.afterSave("Emotion", function (request, response) {
	var emoj = request.object;
	// suppose to increment the emotions will be fine,
	// but right now I call the countEmoj everytime.

	var query = new Parse.Query("Posts");
	Parse.Promise.when([
		Parse.Cloud.run("countEmoj", { post: emoj.get("post").id}),
		query.get(emoj.get("post").id)
	]).then( function (count, post) {
		console.log(count);
		post.set("emotions", count);
		post.save();
	}, function (error) {
		console.error(error);
	});
});

Parse.Cloud.afterDelete("Emotion", function (request, response) {
	var emoj = request.object;
	// suppose to increment the emotions will be fine,
	// but right now I call the countEmoj everytime.

	var query = new Parse.Query("Posts");
	Parse.Promise.when([
		Parse.Cloud.run("countEmoj", { post: emoj.get("post").id}),
		query.get(emoj.get("post").id)
	])
	.then( function (count, post) {
		console.log(count);
		post.set("emotions", count);
		post.save();
	}, function (error) {
		console.error(error);
	});
});
