import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "./blogForm";
import { createPost } from "../api/blog.api";
import { BlogPost } from "../types/types";
import { useSite } from "@/features/sites/components/siteContext";
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export const AddBlogForm = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { activeSite } = useSite();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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

  const getTableName = (): string => {
    if (activeSite?.tableName) return activeSite.tableName;
    if (activeSite?.name === "Snorkeling Adventure") return "snorkell";
    if (activeSite?.name === "Cenote Adventuring") return "cenote";
    return "";
  };

  const handleCreate = async (data: BlogPost) => {
    const tableName = getTableName();

    if (!tableName) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Configuration Error",
        description: "Could not determine the active site."
      });
      return;
    }

    setLoading(true);
    try {
      const payload: BlogPost = {
        ...data,
        siteId: siteId || "",
        tableName: tableName,
      };

      await createPost(payload, tableName);
      
      setModal({
        isOpen: true,
        type: "success",
        title: "Published!",
        description: "Your new post has been successfully created."
      });

    } catch (error: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error saving",
        description: error.response?.data?.message || "An error occurred."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-background overflow-hidden">
      <BlogForm onSubmit={handleCreate} isLoading={loading} />
      
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
