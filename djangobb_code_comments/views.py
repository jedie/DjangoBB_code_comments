# coding:utf-8

"""
    code comments for DjangoBB
    ~~~~~~~~~~~~~~~~~~~~~~~~~~

    :copyleft: 2012 by Jens Diemer, see AUTHORS for more details.
    :license: GNU GPL v3 or above, see LICENSE for more details
"""

try:
    import json # New in Python v2.6
except ImportError:
    from django.utils import simplejson as json

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import SuspiciousOperation
from django.db import transaction
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.utils.translation import ugettext as _

from djangobb_code_comments.forms import CommentDisplayForm, CommentValidationForm
from django.conf import settings
from djangobb_code_comments.models import CodeComment


@login_required
def get_form(request):
    context = {"form": CommentDisplayForm()}
    return render_to_response(
        "code_comments/form.html", context, context_instance=RequestContext(request)
    )

@login_required
@transaction.commit_on_success
def add_comments(request):
    if request.method != "POST":
        raise SuspiciousOperation("Code comment didn't send via POST")

    form = CommentValidationForm(request.POST)
    if not form.is_valid():
        msg = "Code comment form not valid!"
        if settings.DEBUG:
            msg += " (%s)" % repr(form.errors)
        context = {"form": form }
        return render_to_response(
            "code_comments/form.html", context, context_instance=RequestContext(request)
        )
        raise SuspiciousOperation(msg)

    comment = form.save(commit=False)
    comment.user = request.user
    comment.save()
    messages.success(request, _("Your code commend saved."))
    return HttpResponse("RELOAD", content_type="text")
    url = comment.post.get_absolute_url()
    return HttpResponseRedirect(url)

def get_comments(request):
    raw_post_ids = request.GET["post_ids"]
    post_ids = [int(post_id) for post_id in raw_post_ids.split() if post_id]
    queryset = CodeComment.objects.filter(post__id__in=post_ids)
    queryset = queryset.filter(public=True)
    queryset = queryset.select_related()
    comments = []
    for comment in queryset:
        comments.append({
            "post_id": comment.post.id,
            "line_no": comment.line_no,
            "username": comment.user.username,
            "comment": comment.comment,
        })
    comments_json = json.dumps(comments)
    return HttpResponse(comments_json, content_type="application/json")
