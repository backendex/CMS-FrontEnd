import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export type PostStatus = "draft" | "published"

export interface PostFormValues {
  title: string
  content: string
  status: PostStatus
}

interface PostFormProps {
  initialValues?: PostFormValues
  onSubmit: (values: PostFormValues) => void
  isLoading?: boolean
}

export function PostForm({
  initialValues,
  onSubmit,
  isLoading = false,
}: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>({
    title: initialValues?.title ?? "",
    content: initialValues?.content ?? "",
    status: initialValues?.status ?? "draft",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Título del post"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          name="content"
          value={values.content}
          onChange={handleChange}
          placeholder="Escribe tu contenido aquí..."
          rows={10}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant={values.status === "draft" ? "default" : "outline"}
          onClick={() =>
            setValues((v) => ({ ...v, status: "draft" }))
          }
        >
          Borrador
        </Button>
        <Button
          type="button"
          variant={values.status === "published" ? "default" : "outline"}
          onClick={() =>
            setValues((v) => ({ ...v, status: "published" }))
          }
        >
          Publicado
        </Button>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  )
}
