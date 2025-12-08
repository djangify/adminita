from django.contrib import admin
from .models import Category, Tag, Post, Comment


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "category", "status", "is_featured", "views", "created_at"]
    list_filter = ["status", "is_featured", "category", "created_at"]
    search_fields = ["title", "content"]
    prepopulated_fields = {"slug": ("title",)}
    raw_id_fields = ["author"]
    filter_horizontal = ["tags"]
    date_hierarchy = "created_at"
    inlines = [CommentInline]

    fieldsets = (
        (None, {"fields": ("title", "slug", "author")}),
        ("Content", {"fields": ("excerpt", "content", "featured_image")}),
        ("Organization", {"fields": ("category", "tags")}),
        (
            "Publishing",
            {"fields": ("status", "is_featured", "published_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["author_name", "post", "is_approved", "created_at"]
    list_filter = ["is_approved", "created_at"]
    search_fields = ["author_name", "author_email", "content"]
    actions = ["approve_comments"]

    @admin.action(description="Approve selected comments")
    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
