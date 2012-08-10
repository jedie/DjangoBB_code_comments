# coding:utf-8

"""
    code comments for DjangoBB
    ~~~~~~~~~~~~~~~~~~~~~~~~~~

    :copyleft: 2012 by Jens Diemer, see AUTHORS for more details.
    :license: GNU GPL v3 or above, see LICENSE for more details
"""

from django import forms

from djangobb_code_comments.models import CodeComment


class CommentDisplayForm(forms.ModelForm):
    """ used only for generating the comment form """
    class Meta:
        model = CodeComment
        fields = ("comment",)

class CommentValidationForm(forms.ModelForm):
    """ used only for validating and save the incomming comment data """
    class Meta:
        model = CodeComment
        exclude = ("user", "public")
