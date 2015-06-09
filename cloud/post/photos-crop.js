var Image = require("parse-image");

Parse.Cloud.beforeSave("PostImage", function (request, response) {
	var postImage = request.object;
	postImage.set("byPost", postImage.get("byPost"));

	Parse.Cloud.httpRequest({
		url: postImage.get("Image").url()
	}).then(function (response) {
		var image = new Image();
		return image.setData(response.buffer);
	}).then(function (image) {
		// Crop the image to the smaller of width or height.
	    var ratio = 600/image.width();
		return image.scale({
			width:128, height:128
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
    	postImage.set("previewImage", preview);
    }).then(function (result) {
    	response.success
    }).then(function(result) {
		response.success();
	}, function(error) {
		response.error(error);
	});

});