import { PostForm, PostFormValues } from "@/features/post/components/postForm"

export default function PostEditPage() {
  function handleSubmit(values: PostFormValues) {
    console.log("POST:", values)
    // aquí luego llamas a la API
  }

  return (
    <div>
      <PostForm onSubmit={handleSubmit} />
    </div>
  )
}
