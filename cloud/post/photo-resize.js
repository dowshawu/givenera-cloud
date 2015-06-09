var Image = require("parse-image");

Parse.Cloud.beforeSave("Posts", function (request, response) {
	var post = request.object;
	// if (!post.dirty("Image")) {
	// 	// The photo isn't being modified.
	// 	response.success();
	// 	return;
	// }

	Parse.Cloud.httpRequest({
		url: post.get("Image").url()
	}).then(function (response) {
		var image = new Image();
		return image.setData(response.buffer);
	}).then(function (image) {
		// Crop the image to the smaller of width or height.
	    var ratio = 400/image.width();
		return image.scale({
			ratio : ratio
	    });
	}).then(function (image) {
    // Make sure it's a JPEG to save disk space and bandwidth.
    	return image.setFormat("JPEG");
    }).then(function (image) {
    	return image.data();
    }).then(function (buffer) {
    	var base64 = buffer.toString("base64");
    	var preview = new Parse.File("preview.jpg", {base64: base64 });
    	return preview.save();
    }).then(function (preview) {
    	post.set("previewImage", preview);
    }).then(function (result) {
    	response.success
    }).then(function(result) {
		response.success();
	}, function(error) {
		response.error(error);
	});

});