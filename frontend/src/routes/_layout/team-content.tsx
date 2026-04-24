import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import Image from "@tiptap/extension-image"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"
import { TeamContentService } from "@/client"
import { Button } from "@/components/ui/button"
import useCustomToast from "@/hooks/useCustomToast"

export const Route = createFileRoute("/_layout/team-content")({
  component: TeamContentEditor,
  head: () => ({
    meta: [{ title: "球队介绍编辑 - 鹏飏" }],
  }),
})

function TeamContentEditor() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-team-content"],
    queryFn: () => TeamContentService.getTeamContent(),
  })

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[300px] p-4 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]",
      },
    },
  })

  useEffect(() => {
    if (data?.content && editor) {
      editor.commands.setContent(data.content)
    }
  }, [data, editor])

  const mutation = useMutation({
    mutationFn: (content: string) =>
      TeamContentService.updateTeamContent({
        requestBody: { content },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-content"] })
      queryClient.invalidateQueries({ queryKey: ["public-team-content"] })
      showSuccessToast("球队介绍已保存")
    },
    onError: () => {
      showErrorToast("保存失败，请重试")
    },
  })

  const handleSave = () => {
    if (!editor) return
    mutation.mutate(editor.getHTML())
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">球队介绍编辑</h1>
        <Button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="bg-[#111111] text-white hover:bg-[#292929]"
        >
          {mutation.isPending ? "保存中..." : "保存"}
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
