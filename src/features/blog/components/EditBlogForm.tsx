import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "./blogForm";
import { getPostById, updatePost } from "../api/blog.api";
import { BlogPost } from "../types/types";
import { useSite } from "@/features/sites/components/siteContext";
import { StatusModal, StatusType } from "@/components/ui/status-modal";
import { Loader2 } from "lucide-react";

export const EditBlogForm = () => {
  const { siteId, id } = useParams<{ siteId: string; id: string }>();
  const { activeSite } = useSite();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [postData, setPostData] = useState<BlogPost | null>(null);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: StatusType;
    title: string;
    description?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const getTableName = () => {
    if (activeSite?.tableName) return activeSite.tableName;
    if (activeSite?.name === "Snorkeling Adventure") return "snorkell";
    if (activeSite?.name === "Cenote Adventuring") return "cenote";
    return "";
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!id || !siteId) return;
      try {
        setLoading(true);
        const tableName = getTableName();
        if (!tableName) return;
        const data = await getPostById(id, siteId, tableName);
        setPostData(data);
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, siteId, activeSite]);

  const handleUpdate = async (data: BlogPost) => {
    if (!id) return;
    setSaving(true);
    try {
      const tableName = getTableName();
      await updatePost(id, { ...data, tableName });
      setModal({
        isOpen: true,
        type: "success",
        title: "Updated!",
        description: "The changes have been saved successfully."
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Update Error",
        description: error.response?.data?.message || "An error occurred."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full bg-background overflow-hidden">
      {postData && <BlogForm initialData={postData} onSubmit={handleUpdate} isLoading={saving} />}
      
      <StatusModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onAction={() => {
          closeModal();
          if (modal.type === "success") {
            navigate(`/dash/${siteId}/blog`);
          }
        }}
      />
    </div>
  );
}
