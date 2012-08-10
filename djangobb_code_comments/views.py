# coding:utf-8

"""
    code comments for DjangoBB
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    :copyleft: 2012 by Jens Diemer, see AUTHORS for more details.
    :license: GNU GPL v3 or above, see LICENSE for more details
"""

from django.shortcuts import render_to_response
from django.template.context import RequestContext

from djangobb_code_comments.forms import AuthorForm


def get_form(request):
    context = {
        "form": AuthorForm(),
    }
    return render_to_response(
        "code_comments/form.html", context, context_instance=RequestContext(request)
    )

def add_comments(request):
    pass
