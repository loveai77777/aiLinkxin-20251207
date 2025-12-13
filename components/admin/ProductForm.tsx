"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";

interface ProductFormProps {
  product?: any;
  links?: any[];
}

export default function ProductForm({ product, links: initialLinks = [] }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState(initialLinks);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    short_description: product?.short_description || "",
    category: product?.category || "",
    tags: product?.tags?.join(", ") || "",
    content_markdown: product?.content_markdown || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClientSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: any = {
        name: formData.name,
        slug: formData.slug,
        short_description: formData.short_description || null,
        category: formData.category || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        content_markdown: formData.content_markdown || null,
        updated_at: new Date().toISOString(),
      };

      let productId: number;

      if (product) {
        // Update existing
        const { data, error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id)
          .select()
          .single();

        if (updateError) throw updateError;
        productId = product.id;
      } else {
        // Create new
        payload.created_at = new Date().toISOString();
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(payload)
          .select()
          .single();

        if (insertError) throw insertError;
        productId = data.id;
      }

      // Save links
      if (productId) {
        // Delete existing links
        if (product) {
          await supabase
            .from("picks_product_links")
            .delete()
            .eq("product_id", productId);
        }

        // Insert new links
        const linksToInsert = links
          .filter((link) => link.affiliate_url || link.destination_url)
          .map((link, index) => ({
            product_id: productId,
            affiliate_url: link.affiliate_url || null,
            destination_url: link.destination_url || null,
            cta_text: link.cta_text || null,
            country_codes: link.country_codes || null,
            priority: link.priority || index + 1,
            status: link.status || "active",
          }));

        if (linksToInsert.length > 0) {
          const { error: linksError } = await supabase
            .from("picks_product_links")
            .insert(linksToInsert);

          if (linksError) throw linksError;
        }
      }

      router.push("/admin/picks");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const addLink = () => {
    setLinks([
      ...links,
      {
        affiliate_url: "",
        destination_url: "",
        cta_text: "",
        country_codes: null,
        priority: links.length + 1,
        status: "active",
      },
    ]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: string, value: any) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
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
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description
        </label>
        <textarea
          value={formData.short_description}
          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="tag1, tag2, tag3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content (Markdown)
        </label>
        <textarea
          value={formData.content_markdown}
          onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
          rows={15}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Product Links
          </label>
          <button
            type="button"
            onClick={addLink}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Add Link
          </button>
        </div>
        <div className="space-y-4">
          {links.map((link, index) => (
            <div key={index} className="border border-gray-200 rounded p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Link {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Affiliate URL</label>
                  <input
                    type="url"
                    value={link.affiliate_url || ""}
                    onChange={(e) => updateLink(index, "affiliate_url", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Destination URL</label>
                  <input
                    type="url"
                    value={link.destination_url || ""}
                    onChange={(e) => updateLink(index, "destination_url", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={link.cta_text || ""}
                    onChange={(e) => updateLink(index, "cta_text", e.target.value)}
                    placeholder="Visit website"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Priority</label>
                  <input
                    type="number"
                    value={link.priority || index + 1}
                    onChange={(e) => updateLink(index, "priority", parseInt(e.target.value))}
                    min="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
          {links.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No links added. Click "Add Link" to add one.
            </p>
          )}
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

