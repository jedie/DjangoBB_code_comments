# coding:utf-8

"""
    code comments for DjangoBB
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    :copyleft: 2012 by Jens Diemer, see AUTHORS for more details.
    :license: GNU GPL v3 or above, see LICENSE for more details
"""


from django.conf.urls import patterns, url

from djangobb_code_comments.views import get_form, add_comments

urlpatterns = patterns('',
    url('^topic/\d+/get_code_comments_form/$', get_form, name="get_form"),
    url('^code_comments/add/$', add_comments, name="add_comments"),
)
