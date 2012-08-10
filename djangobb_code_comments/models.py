# coding:utf-8

"""
    'models'
    ~~~~~~~~
    
    :copyleft: 2012 by Jens Diemer, see AUTHORS for more details.
    :license: GNU GPL v3 or above, see LICENSE for more details
"""

from django.db import models

from djangobb_forum.models import Post


class CodeComments(models.Model):
    post = models.ForeignKey(Post)
    line_no = models.PositiveIntegerField() # or PositiveSmallIntegerField ?
    comment = models.CharField(max_length=255) # max_length to which value ?
