"use client";

import { useState, FormEvent } from "react";
import type { PlaybookComment } from "@/lib/playbook";

interface PlaybookCommentsProps {
  playbookId: number;
  initialComments: PlaybookComment[];
}

/**
 * Playbook 评论区组件
 * 
 * 功能：
 * - 显示已审核的评论（status='approved'）
 * - 提交新评论（status='pending'，待后台审核）
 * - 评论状态流转：pending -> approved/rejected（由后台管理）
 */
export default function PlaybookComments({
  playbookId,
  initialComments,
}: PlaybookCommentsProps) {
  const [comments, setComments] = useState<PlaybookComment[]>(initialComments);
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: null, text: "" });

    try {
      const response = await fetch("/api/playbook/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playbookId,
          authorName: formData.authorName,
          authorEmail: formData.authorEmail || null,
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({
          type: "success",
          text: "评论已提交，待审核后显示",
        });
        // 清空表单
        setFormData({
          authorName: "",
          authorEmail: "",
          content: "",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: data.error || "提交失败，请稍后重试",
        });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSubmitMessage({
        type: "error",
        text: "提交失败，请稍后重试",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>

      {/* 评论列表 */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold text-white">
                    {comment.author_name}
                  </span>
                  {comment.author_email && (
                    <span className="text-sm text-gray-400 ml-2">
                      ({comment.author_email})
                    </span>
                  )}
                </div>
                <time className="text-sm text-gray-400">
                  {formatDate(comment.created_at)}
                </time>
              </div>
              <p className="text-white leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mb-8">No comments yet. Be the first to comment!</p>
      )}

      {/* 提交评论表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-medium text-white mb-2"
          >
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="authorName"
            required
            value={formData.authorName}
            onChange={(e) =>
              setFormData({ ...formData, authorName: e.target.value })
            }
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="authorEmail"
            className="block text-sm font-medium text-white mb-2"
          >
            Email (optional)
          </label>
          <input
            type="email"
            id="authorEmail"
            value={formData.authorEmail}
            onChange={(e) =>
              setFormData({ ...formData, authorEmail: e.target.value })
            }
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-white mb-2"
          >
            Comment <span className="text-red-400">*</span>
          </label>
          <textarea
            id="content"
            required
            rows={4}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            placeholder="Write your comment here..."
          />
        </div>

        {submitMessage.type && (
          <div
            className={`p-3 rounded-lg ${
              submitMessage.type === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Comment"}
        </button>
      </form>
    </div>
  );
}


