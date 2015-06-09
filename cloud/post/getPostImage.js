Parse.cloud.define("getPostImage", function (request, response) {
	'use strict';
	var postImageQuery = new Parse.Query("PostImage");
	postImageQuery.equalTo("byPost", request.params.objectId)
	postImageQuery.find({
		success: function(result){
			var postImageList = [];
			for (var i=0; i<9; i++){
				postImageList.push(result[i]);
			}
			response.success(postImageList);
		},
		error: function(){
    		response.error("category Lookup failed");
    	}
	});
});