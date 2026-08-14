import React from "react";
import EmailSignup from "./EmailSignup";

/**
 * Minimal BlogPost component / template.
 * - Expects a `title` and `html` (string) props for content.
 * - Renders the article and places EmailSignup after the post content.
 *
 * Replace the PostType with your actual post type if available.
 */

type PostType = {
  title: string;
  html: string; // rendered HTML of the post
  date?: string;
  author?: string;
};

const BlogPost: React.FC<{ post: PostType }> = ({ post }) => {
  return (
    <article className="prose prose-invert max-w-4xl mx-auto px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">{post.title}</h1>
        {post.date && <p className="text-gray-400 text-sm mt-1">{post.date}</p>}
      </header>

      <section
        className="prose prose-invert"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {/* Email signup inserted at the bottom of every post */}
      <div className="mt-12">
        <EmailSignup />
      </div>

      <footer className="mt-8 text-gray-500 text-sm">
        <p>Thanks for reading — share this post with other anime fans!</p>
      </footer>
    </article>
  );
};

export default BlogPost;
