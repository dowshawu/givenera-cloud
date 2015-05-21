Parse.Cloud.define("getCategory", function(request, response) {
    'use strict';
    var category = new Parse.Query("Category");
    category.find({
    	success: function(result){
    		var categoryList = [];
    		for (var i=0; i<result.length; ++i) {
    			categoryList.push(result[i].get("Category"));
    		}
    		response.success(categoryList);
    	},
    	error: function(){
    		response.error("category Lookup failed");
    	}
    })
});