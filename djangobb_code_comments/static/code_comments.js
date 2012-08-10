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
    $("table.codetable .line").click(function() {
        var obj=$(this);
        if (obj.length!=1) {
            log("selecte didn't match!");
            return
        }
        log("click on text:" + obj.text());
        var raw_class=obj.attr("class");
        //log("raw_class:" + raw_class);
        var line_no = raw_class.split(" ")[1];
        log("line no:" + line_no);
    });
});
