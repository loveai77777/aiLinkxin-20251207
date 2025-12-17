"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CategoriesTagsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Category form
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  
  // Tag form
  const [newTagLabel, setNewTagLabel] = useState("");
  const [editingTag, setEditingTag] = useState<number | null>(null);
  const [editTagLabel, setEditTagLabel] = useState("");

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch("/api/admin/playbook/categories"),
        fetch("/api/admin/playbook/tags-list"),
      ]);

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        setTags(data.tags || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Category handlers
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/playbook/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await response.json();
      if (data.ok && data.category) {
        setCategories([...categories, data.category]);
        setNewCategoryName("");
      } else {
        setError(data.error || "Failed to create category");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: { id: number; name: string }) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/playbook/categories/${editingCategory}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategoryName.trim() }),
      });
      const data = await response.json();
      if (data.ok) {
        setCategories(categories.map(cat => 
          cat.id === editingCategory ? { ...cat, name: editCategoryName.trim() } : cat
        ));
        setEditingCategory(null);
        setEditCategoryName("");
      } else {
        setError(data.error || "Failed to update category");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? This will remove it from all playbooks.")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/playbook/categories/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.ok) {
        setCategories(categories.filter(cat => cat.id !== id));
      } else {
        setError(data.error || "Failed to delete category");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  // Tag handlers
  const handleCreateTag = async () => {
    if (!newTagLabel.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/playbook/tags-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newTagLabel.trim() }),
      });
      const data = await response.json();
      if (data.ok && data.tag) {
        setTags([...tags, data.tag]);
        setNewTagLabel("");
      } else {
        setError(data.error || "Failed to create tag");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create tag");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTag = (tag: { id: number; label: string }) => {
    setEditingTag(tag.id);
    setEditTagLabel(tag.label);
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editTagLabel.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/playbook/tags-list/${editingTag}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: editTagLabel.trim() }),
      });
      const data = await response.json();
      if (data.ok) {
        setTags(tags.map(tag => 
          tag.id === editingTag ? { ...tag, label: editTagLabel.trim() } : tag
        ));
        setEditingTag(null);
        setEditTagLabel("");
      } else {
        setError(data.error || "Failed to update tag");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update tag");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tag? This will remove it from all playbooks.")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/playbook/tags-list/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.ok) {
        setTags(tags.filter(tag => tag.id !== id));
      } else {
        setError(data.error || "Failed to delete tag");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories & Tags Management</h1>
        <Link
          href="/admin/playbooks"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Playbooks
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
          
          {/* Create Category */}
          <div className="mb-4 pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCategoryName.trim() && !loading) {
                    e.preventDefault();
                    handleCreateCategory();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                onClick={handleCreateCategory}
                disabled={loading || !newCategoryName.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                {editingCategory === category.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateCategory();
                        } else if (e.key === "Escape") {
                          setEditingCategory(null);
                          setEditCategoryName("");
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateCategory}
                      disabled={loading}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setEditCategoryName("");
                      }}
                      className="px-2 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={loading}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No categories yet</p>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
          
          {/* Create Tag */}
          <div className="mb-4 pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Tag
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                placeholder="Enter tag label"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTagLabel.trim() && !loading) {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                onClick={handleCreateTag}
                disabled={loading || !newTagLabel.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                {editingTag === tag.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editTagLabel}
                      onChange={(e) => setEditTagLabel(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateTag();
                        } else if (e.key === "Escape") {
                          setEditingTag(null);
                          setEditTagLabel("");
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateTag}
                      disabled={loading}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTag(null);
                        setEditTagLabel("");
                      }}
                      className="px-2 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-900">#{tag.label}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTag(tag)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        disabled={loading}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No tags yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








