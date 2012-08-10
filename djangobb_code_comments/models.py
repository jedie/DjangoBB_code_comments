# coding:utf-8

"""
    'models'
    ~~~~~~~~
    
    :copyleft: 2012 by Jens Diemer, see AUTHORS for more details.
    :license: GNU GPL v3 or above, see LICENSE for more details
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from djangobb_forum.models import Post


class CodeComment(models.Model):
    post = models.ForeignKey(Post)
    #TODO: code_block = models.PositiveSmallIntegerField(_("code block"))
    line_no = models.PositiveIntegerField(_("line no")) # or PositiveSmallIntegerField ?
    comment = models.TextField(_("comment"))
    user = models.ForeignKey(User)
    created = models.DateTimeField(_("created"), auto_now_add=True)
    public = models.BooleanField(_("public"), default=True)

    class Meta:
        unique_together = (
            ("user", "post", "line_no", "comment"),
        )
