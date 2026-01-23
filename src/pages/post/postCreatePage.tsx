import { PostForm, PostFormValues } from "@/features/post/components/postForm"
import { createPost } from "@/features/post/services/postService"
import { useNavigate } from "react-router-dom"

export default function PostCreatePage() {
  const navigate = useNavigate()

  async function handleSubmit(values: PostFormValues) {
    await createPost(values)
    navigate("/dash/post/create")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Crear post</h1>
      <PostForm
        onSubmit={handleSubmit}
        isLoading={false}
      />
    </div>
  )
}
