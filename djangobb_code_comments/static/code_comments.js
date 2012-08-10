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
    
    var response_text = XMLHttpRequest.responseText;
    log("response_text: '" + response_text + "'");
    
    // display error page
    document.open();
    document.write(response_text);
    document.close();
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

function send_comment(post_id, line_no, comment){
    log("send for post "+post_id+" line "+line_no+" comment:'"+comment+"'");
    var post_data = {
        "post": post_id,
        "line_no": line_no,
        "comment":comment
    };
    $.ajax({
        async: false,
        url: 'add_code_comment/',
        type: "POST",
        data: post_data,
        dataType: "text",
        success: function(data, textStatus) {
            log("success, textStatus: " + textStatus);
            log("data:"+data);
            if (data=="RELOAD") {
                location.reload(true);
            } else {
                alert("send comment error:"+data);
            }
        },
        complete: ajax_complete_handler,
        error: ajax_error_handler
    });
}
function add_comment(post_id, line_no, username, comment){
    log("add comment from '"+username+"' to post id:"+post_id);
    var comment_html='<p title="line no '+line_no+'"><strong>'+username+'</strong>:'+comment+'</p>';
    log(comment_html);
    var obj=$("a[name=post-"+post_id+"]").nextAll("div").find("table.codetable");
    if (obj.length!=1) {
        log("Error: Can't get code block!");
        return
    };
    obj.find("a[name=True-"+line_no+"]").after(comment_html);
}
function get_comments(){
    var post_ids=new Array();
    $("a[name^=post-]").each(function(index) {
        var raw_post_id=$(this).attr("name");
        //log("raw_post_id:"+raw_post_id);
        var id = raw_post_id.split("-")[1];
        //log("post id:"+id);
        post_ids[post_ids.length] = id;
    });
    log("request comments for:" + post_ids);
    var get_data = {
        "post_ids":post_ids.join(" "),
    }
    log("request comments raw GET data:" + get_data);
    $.ajax({
        async: false,
        url: 'get_code_comments/',
        type: "GET",
        data: get_data,
        dataType: "json",
        success: function(data, textStatus) {
            log("data:"+data);
            $(data).each(function(index) {
                add_comment(this.post_id, this.line_no, this.username, this.comment);
            });
        },
        complete: ajax_complete_handler,
        error: ajax_error_handler
    });
}

last_selected_lineno_obj=null;
$(document).ready(function() {
    $("table.codetable span").click(function() {
        var obj=$(this);
        if (obj.length!=1) {
            log("Error: Selector didn't match!");
            return
        };
        log("click on text:" + obj.text());

        // get the line on which the user have clicked
        var lineno_obj = obj.prevUntil("a").prev("a"); // pygments and click not on the first <span>
        if (lineno_obj.length!=1) {
            // no pygments or clicked on the first <span> code part
            var lineno_obj = obj.prev("a");
        }
        if (lineno_obj.length!=1) {
            log("Error: Can't get line <a> object.");
            return
        };
        
        //mark the complete code line:
        lineno_obj.nextUntil("a").css("background-color", "#ffffbb");
        
        // get the line number:
        var raw_lineno = lineno_obj.attr("name")
        //log("raw_lineno:" + raw_lineno);
        var lineno = raw_lineno.split("-")[1];
        log("lineno:" + lineno);
        
        // traversal the post ID in which the clicked code block is
        var post_obj = obj.parents(".blockpost");
        if (post_obj.length!=1) {
            log("Error: Can't get post div with the ID attribute.");
            return
        };
        var raw_post_id = post_obj.attr("id");
        //log("raw_post_id:"+raw_post_id);
        if (raw_post_id==undefined) {
            log("Error: Can't get post id!");
            return
        };
        var post_id = raw_post_id.split("p")[1];
        log("post_id:"+post_id);
        
        var form_id="code_comments_post_"+post_id;
        
        if (last_selected_lineno_obj!=null) {
            // user has clicked in the past a other line
            // -> unmark it
            last_selected_lineno_obj.nextUntil("a").css("background-color", "");
        }
        last_selected_lineno_obj=lineno_obj;
        
        // user clicked the first time on this code block
        // -> get and add the comment form
        var form_html = get_comments_form()
        //log("form_html:"+form_html);

        var table_obj=obj.parents("table.codetable")
        log("add comment form, after:"+table_obj);
        table_obj.after(form_html);
        
        // the the form as a object:
        var form_obj=table_obj.next("form");
        form_obj.attr("id", form_id)
        log("set form id to:"+form_id)
        
        form_obj.submit(function() {
            log('Handler for .submit() called.');
            var comment_obj = $(this).find("#id_comment");
            if (comment_obj.length!=1) {
                log("Error: Can't get comment form field!");
                return false
            };
            var comment=comment_obj.val();
            send_comment(post_id, lineno, comment);
            //$(this).find("#id_post").attr("value", post_id);
            //$(this).find("#id_line_no").attr("value", lineno);
            return false;
        });
    });
    get_comments()
});
log("code_comments.js loaded");