# coding: utf-8

from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from djangobb_code_comments.models import CodeComment


class CodeCommentAdmin(admin.ModelAdmin):
    list_display = ("user", "post", "line_no", "created", "public", "comment")
    list_display_links = ("user", "post", "line_no")
    list_editable = ("public",)
    list_filter = ("public",)

admin.site.register(CodeComment, CodeCommentAdmin)

