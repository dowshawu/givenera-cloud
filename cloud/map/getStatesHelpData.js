// [
//     {States:"HI", times:12},
//     {States:"AK", times:10}
// ]
// ==>
// {
//     HI:{times:12, color:200},
//     AK:{times:10, color:220}
// }

Parse.Cloud.define("getStatesHelpData", function(request, response){
    var StatesHelpQuery = new Parse.Query("StatesHelp");
    StatesHelpQuery.find({
        success: function(StatesHelp){
            response.success(StatesHelp);
        },
        error:function() {
            response.error("StatesHelpObj Lookup failed");
        }
    });
});