import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BlogForm({ editMode = false }) {
  const [formData, setFormData] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/blog/${id}`, {
            credentials: "include",
          });
          const data = await res.json();
          setFormData({ ...data, tags: data.tags.join(", ") });
        } catch (err) {
          console.error("Error fetching blog:", err);
        }
      };
      fetchBlog();
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const response = await fetch(
        editMode 
          ? `http://localhost:5000/api/posts/${id}`
          : "http://localhost:5000/api/posts",
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(blogData),
        }
      );

      if (!response.ok) throw new Error("Failed to save blog");

      navigate("/blogs");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div>
      <h2>{editMode ? "Edit" : "Create"} Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={formData.title}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          onChange={handleChange}
          value={formData.content}
          required
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleChange}
          value={formData.tags}
        />
        <button type="submit">{editMode ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default BlogForm;