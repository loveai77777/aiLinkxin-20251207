"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PlaybookFormProps {
  playbook?: any;
}

export default function PlaybookForm({ playbook }: PlaybookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
  const [formData, setFormData] = useState({
    title: playbook?.title || "",
    slug: playbook?.slug || "",
    subtitle: playbook?.subtitle || "",
    summary: playbook?.summary || "",
    content_markdown: playbook?.content_markdown || "",
    status: playbook?.status || "draft",
    reading_minutes: playbook?.reading_minutes || null,
    category_id: playbook?.category_id || null,
    tagIds: playbook?.tagIds || [] as number[],
  });


  // Fetch categories and tags on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/admin/playbook/categories");
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.categories || []);
        }

        // Fetch tags
        const tagsRes = await fetch("/api/admin/playbook/tags-list");
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setTags(tagsData.tags || []);
        }

        // If editing, fetch current category and tags
        if (playbook?.id) {
          const playbookRes = await fetch(`/api/admin/playbook/${playbook.id}`);
          if (playbookRes.ok) {
            const playbookData = await playbookRes.json();
            if (playbookData.ok && playbookData.playbook) {
              setFormData((prev) => ({
                ...prev,
                category_id: playbookData.playbook.category_id || null,
                tagIds: playbookData.playbook.tagIds || [],
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching form data:", err);
      }
    }
    fetchData();
  }, [playbook?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        title: formData.title,
        slug: formData.slug,
        subtitle: formData.subtitle || null,
        summary: formData.summary || null,
        content_markdown: formData.content_markdown || null,
        status: formData.status,
        reading_minutes: formData.reading_minutes ? parseInt(formData.reading_minutes.toString()) : null,
        category_id: formData.category_id || null,
        tagIds: formData.tagIds || [],
        updated_at: new Date().toISOString(),
      };

      let playbookId: number;

      if (playbook) {
        // Update existing - use API route
        const response = await fetch(`/api/admin/playbook/${playbook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Failed to update playbook");
        }
        playbookId = playbook.id;
      } else {
        // Create new - use API route
        if (formData.status === "published") {
          payload.published_at = new Date().toISOString();
        }
        
        const response = await fetch("/api/admin/playbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Failed to create playbook");
        }
        playbookId = data.id;
      }

      // Tags are already saved in the API route, no need to save separately

      router.push("/admin/playbooks");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug *
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          pattern="[a-z0-9-]+"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <p className="mt-1 text-xs text-gray-500">Lowercase letters, numbers, and hyphens only</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Summary
        </label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content (Markdown) *
        </label>
        <textarea
          value={formData.content_markdown}
          onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
          rows={20}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <a
            href="/admin/playbooks/categories-tags"
            target="_blank"
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Manage Categories
          </a>
        </div>
        <select
          value={formData.category_id || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              category_id: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Tags (Select up to 3)
          </label>
          <a
            href="/admin/playbooks/categories-tags"
            target="_blank"
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Manage Tags
          </a>
        </div>
        <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={formData.tagIds.includes(tag.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Limit to 3 tags
                    if (formData.tagIds.length < 3) {
                      setFormData({
                        ...formData,
                        tagIds: [...formData.tagIds, tag.id],
                      });
                    }
                  } else {
                    setFormData({
                      ...formData,
                      tagIds: formData.tagIds.filter((id: number) => id !== tag.id),
                    });
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">#{tag.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Selected: {formData.tagIds.length} / 3
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reading Minutes
          </label>
          <input
            type="number"
            value={formData.reading_minutes || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                reading_minutes: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}



