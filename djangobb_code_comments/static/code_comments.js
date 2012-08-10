/*****************************************************************************
* helper function for console logging
*/
function log() {
    if (window.console && window.console.log) {
        try {
            window.console.log(Array.prototype.join.call(arguments,''));
        } catch (e) {
            log("Error:" + e);
        }
    }
}

/*****************************************************************************
* Django CSRF exception for AJAX requests
*/
jQuery(document).ajaxSend(function(event, xhr, settings) {
    log("ajax send...");
    
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        log("set X-CSRFToken to:"+ getCookie('csrftoken'));
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

/*****************************************************************************
* AJAX logging handler
*/

function ajax_error_handler(XMLHttpRequest, textStatus, errorThrown) {
    log("ajax get response error!");
    log("textStatus:" + textStatus);
    log(XMLHttpRequest);
}
function ajax_complete_handler(XMLHttpRequest, textStatus){
    log("response complete - status:" + textStatus + "("+XMLHttpRequest.status+")");
}

/*****************************************************************************
* code comments stuff:
*/

code_comments_form=null;
function get_comments_form() {
    if (code_comments_form==null) {
        log("request comments form");
        $.ajax({
            async: false,
            url: 'get_code_comments_form/',
            type: "GET",
            dataType: "html",
            success: function(data, textStatus) {
                //log("data:"+data);
                code_comments_form=data;
            },
            complete: ajax_complete_handler,
            error: ajax_error_handler
        });
    } else {
        log("reuse form requested in the past");
    }
    //log("return:"+ code_comments_form);
    return code_comments_form
}


last_selected_lineno_obj=null;
$(document).ready(function() {
    $("table.codetable span").click(function() {
        var obj=$(this);
        if (obj.length!=1) {
            log("Error: Selector didn't match!");
            return
        }
        log("click on text:" + obj.text());

        var lineno_obj = obj.prevUntil("a").prev("a"); // pygments and click not on the first <span>
        if (lineno_obj.length!=1) {
            // no pygments or clicked on the first <span> code part
            var lineno_obj = obj.prev("a");
        }
        if (lineno_obj.length!=1) {
            log("Error: Can't get line <a> object.");
            return
        }
               
        lineno_obj.nextUntil("a").css("background-color", "#ffffbb");
        
        var raw_lineno = lineno_obj.attr("name")
        //log("raw_lineno:" + raw_lineno);
        
        var lineno = raw_lineno.split("-")[1];
        log("lineno:" + lineno);
        
TODO: how get the post ID ???
        
        //var post_obj = obj.prev($("a[name*=post]"));
        var post_obj = obj.prev($("div[id^=p]"));
        if (post_obj.length!=1) {
            log("Error: Can't get post div with the ID attribute.");
            return
        }
        var post_id = post_obj.attr("id");
        log("post_id:"+post_id);
        if (post_id==undefined) {
            log("Error: Can't get post id!");
            return
        }
        
        if (last_selected_lineno_obj!=null) {
            last_selected_lineno_obj.nextUntil("a").css("background-color", "");
        } else {
            var form = get_comments_form()
            log("form:"+form);
            
            $("table.codetable").after(form);            
        }
        last_selected_lineno_obj=lineno_obj;        
        
        $("form#code_comments").submit(function() {
            log('Handler for .submit() called.');
            
            $("form#id_post")
            $("form#id_line_no")
            return false;
        });
    });
});
log("code_comments.js loaded");