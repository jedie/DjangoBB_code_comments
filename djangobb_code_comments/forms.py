# coding:utf-8

"""
    code comments for DjangoBB
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    :copyleft: 2012 by Jens Diemer, see AUTHORS for more details.
    :license: GNU GPL v3 or above, see LICENSE for more details
"""

from django import forms

from djangobb_code_comments.models import CodeComments


class AuthorForm(forms.ModelForm):
    class Meta:
        model = CodeComments
        widgets = {
            "post": forms.HiddenInput(),
            "line_no": forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        super(AuthorForm, self).__init__(*args, **kwargs)
        # Add html attribute in a DRY way
        self.fields["comment"].widget.attrs["required"] = "required"
