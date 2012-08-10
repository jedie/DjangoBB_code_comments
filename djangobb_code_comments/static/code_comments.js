// helper function for console logging
function log() {
    if (window.console && window.console.log) {
        try {
            window.console.log(Array.prototype.join.call(arguments,''));
        } catch (e) {
            log("Error:" + e);
        }
    }
}
log("code_comments.js loaded");

$(document).ready(function() {
    $("table.codetable span").click(function() {
        var obj=$(this);
        if (obj.length!=1) {
            log("selecte didn't match!");
            return
        }
        log("click on text:" + obj.text());
        
        obj.css('background-color', 'red');
        
        var raw_lineno = obj.prevAll("a").attr("name")
        log("raw_lineno:" + raw_lineno);
        
        var lineno = raw_lineno.split("-")[1];
        log("lineno:" + lineno);

    });
});
