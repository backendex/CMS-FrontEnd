import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Link as LinkIcon,
  AlignLeft,
  ChevronDown,
  MoreHorizontal,
  Plus,
  X,
  Search,
  Type,
  ImageIcon,
  FileCode2,
  Table,
  Minus,
  Music,
  Film,
  LayoutGrid,
  SeparatorHorizontal,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

// ─── Block definitions ──────────────────────────────────────
interface BlockDef {
  id: string
  label: string
  icon: React.ReactNode
  category: 'text' | 'media' | 'layout'
  action: (editor: any) => void
}

const BLOCKS: BlockDef[] = [
  // TEXT
  {
    id: 'paragraph', label: 'Paragraph', icon: <Type className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().setParagraph().run(),
  },
  {
    id: 'heading1', label: 'Heading', icon: <Heading1 className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: 'heading2', label: 'Heading 2', icon: <Heading2 className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: 'heading3', label: 'Heading 3', icon: <Heading3 className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    id: 'list', label: 'List', icon: <List className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    id: 'orderedList', label: 'Ordered List', icon: <ListOrdered className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    id: 'quote', label: 'Quote', icon: <Quote className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    id: 'code', label: 'Code', icon: <Code className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: 'separator', label: 'Separator', icon: <Minus className="w-5 h-5" />, category: 'text',
    action: (e) => e.chain().focus().setHorizontalRule().run(),
  },
  // MEDIA
  {
    id: 'image', label: 'Image', icon: <ImageIcon className="w-5 h-5" />, category: 'media',
    action: (e) => {
      const url = window.prompt('URL de la imagen:')
      if (url) e.chain().focus().setImage({ src: url }).run()
    },
  },
  {
    id: 'html', label: 'Custom HTML', icon: <FileCode2 className="w-5 h-5" />, category: 'media',
    action: (e) => {
      e.chain().focus().insertContent('<pre><code>&lt;!-- Tu HTML aquí --&gt;</code></pre>').run()
    },
  },
  // LAYOUT
  {
    id: 'hr', label: 'Divider', icon: <SeparatorHorizontal className="w-5 h-5" />, category: 'layout',
    action: (e) => e.chain().focus().setHorizontalRule().run(),
  },
]

// ─── Block inserter panel ───────────────────────────────────
const BlockInserter = ({
  editor,
  isOpen,
  onClose,
}: {
  editor: any
  isOpen: boolean
  onClose: () => void
}) => {
  const [search, setSearch] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  const filtered = BLOCKS.filter((b) =>
    b.label.toLowerCase().includes(search.toLowerCase())
  )

  const textBlocks = filtered.filter((b) => b.category === 'text')
  const mediaBlocks = filtered.filter((b) => b.category === 'media')
  const layoutBlocks = filtered.filter((b) => b.category === 'layout')

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleInsert = (block: BlockDef) => {
    block.action(editor)
    onClose()
  }

  const Section = ({ title, blocks }: { title: string; blocks: BlockDef[] }) => {
    if (blocks.length === 0) return null
    return (
      <>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 pt-4 pb-1">
          {title}
        </p>
        <div className="grid grid-cols-3 gap-1 px-3 pb-2">
          {blocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => handleInsert(block)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white group-hover:border-slate-300 group-hover:shadow-sm transition-all">
                {block.icon}
              </div>
              <span className="text-[11px] font-medium leading-tight text-center">
                {block.label}
              </span>
            </button>
          ))}
        </div>
      </>
    )
  }

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-0 bottom-0 w-[280px] bg-white border-r border-slate-200 z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold">Blocks</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Blocks grid */}
      <div className="flex-1 overflow-y-auto">
        <Section title="Text" blocks={textBlocks} />
        <Section title="Media" blocks={mediaBlocks} />
        <Section title="Layout" blocks={layoutBlocks} />
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">
            No se encontraron bloques
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main editor props ──────────────────────────────────────
interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editorRef?: React.MutableRefObject<any>
}

interface ToolbarPos {
  top: number
  left: number
}

// ─── Editor component ───────────────────────────────────────
export const RichTextEditor = ({ content, onChange, placeholder, editorRef }: RichTextEditorProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [toolbarPos, setToolbarPos] = useState<ToolbarPos | null>(null)
  const [plusButtonPos, setPlusButtonPos] = useState<ToolbarPos | null>(null)
  const [blocksOpen, setBlocksOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-2xl shadow-lg my-8 mx-auto max-w-full' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Escribe algo o selecciona texto para editar...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px] prose prose-slate max-w-none px-2 py-4 text-base leading-relaxed',
      },
    },
  })

  if (editorRef) editorRef.current = editor

  const updateFloatingElements = useCallback(() => {
    if (!editor) return

    const { from, to } = editor.state.selection
    const hasSelection = from !== to
    const wrapperRect = wrapperRef.current?.getBoundingClientRect()

    if (!wrapperRect) {
      setToolbarPos(null)
      setPlusButtonPos(null)
      return
    }

    if (hasSelection) {
      // Hide plus button when there is a selection
      setPlusButtonPos(null)

      try {
        const startCoords = editor.view.coordsAtPos(from)
        const endCoords = editor.view.coordsAtPos(to)
        
        const toolbarWidth = 440
        const leftCenter = (startCoords.left + endCoords.left) / 2
        let left = leftCenter - wrapperRect.left - toolbarWidth / 2
        left = Math.max(8, Math.min(left, wrapperRect.width - toolbarWidth - 8))

        setToolbarPos({
          top: startCoords.top - wrapperRect.top - 48,
          left,
        })
      } catch (err) {
        setToolbarPos(null)
      }
    } else {
      // Hide formatting menu when there is no selection
      setToolbarPos(null)

      if (!editor.isFocused) {
        setPlusButtonPos(null)
        return
      }

      try {
        const coords = editor.view.coordsAtPos(from)
        // Position + button vertically centered with the current line height
        const top = coords.top - wrapperRect.top + (coords.bottom - coords.top - 28) / 2
        
        setPlusButtonPos({
          top,
          left: blocksOpen ? 280 + 14 : 14,
        })
      } catch (err) {
        setPlusButtonPos(null)
      }
    }
  }, [editor, blocksOpen])

  useEffect(() => {
    if (!editor) return
    editor.on('selectionUpdate', updateFloatingElements)
    editor.on('focus', updateFloatingElements)
    
    const handleBlur = () => {
      setTimeout(() => {
        if (!wrapperRef.current?.contains(document.activeElement)) {
          setPlusButtonPos(null)
        }
      }, 150)
    }
    editor.on('blur', handleBlur)

    return () => {
      editor.off('selectionUpdate', updateFloatingElements)
      editor.off('focus', updateFloatingElements)
      editor.off('blur', handleBlur)
    }
  }, [editor, updateFloatingElements])

  // Recalculate position when blocksOpen changes to shift the plus button
  useEffect(() => {
    updateFloatingElements()
  }, [blocksOpen, updateFloatingElements])

  // Hide toolbar on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (toolbarRef.current?.contains(e.target as Node)) return
      setToolbarPos(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  if (!editor) return null

  const toolbarBtn = (
    onClick: () => void,
    isActive: boolean,
    children: React.ReactNode,
    title?: string
  ) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={`
        flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-all
        ${isActive
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
      `}
    >
      {children}
    </button>
  )

  return (
    <div ref={wrapperRef} className="relative min-h-[440px] w-full bg-transparent">

      {/* Block inserter panel */}
      <BlockInserter
        editor={editor}
        isOpen={blocksOpen}
        onClose={() => setBlocksOpen(false)}
      />

      {/* Floating plus button */}
      {plusButtonPos && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            setBlocksOpen(!blocksOpen)
          }}
          style={{ top: plusButtonPos.top, left: plusButtonPos.left }}
          className="absolute z-40 w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200/80 transition-all hover:scale-105 shadow-sm"
          title="Insertar bloque"
        >
          <Plus className={`w-4 h-4 transition-transform duration-200 ${blocksOpen ? 'rotate-45' : ''}`} />
        </button>
      )}

      {/* Floating selection toolbar */}
      {toolbarPos && (
        <div
          ref={toolbarRef}
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
          className="absolute z-50 flex items-center gap-0.5 px-2 py-1.5 bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              setBlocksOpen(!blocksOpen)
            }}
            className="flex items-center gap-1 px-2 h-7 rounded-md text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
            title="Cambiar tipo de bloque"
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">
              {editor.isActive('heading', { level: 1 }) ? 'Título 1' :
               editor.isActive('heading', { level: 2 }) ? 'Título 2' :
               editor.isActive('heading', { level: 3 }) ? 'Título 3' :
               editor.isActive('blockquote') ? 'Cita' :
               editor.isActive('code') ? 'Código' : 'Texto'}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {toolbarBtn(
            () => editor.chain().focus().toggleBold().run(),
            editor.isActive('bold'),
            <Bold className="h-3.5 w-3.5" />,
            'Negrita'
          )}
          {toolbarBtn(
            () => editor.chain().focus().toggleItalic().run(),
            editor.isActive('italic'),
            <Italic className="h-3.5 w-3.5" />,
            'Cursiva'
          )}
          {toolbarBtn(
            setLink,
            editor.isActive('link'),
            <LinkIcon className="h-3.5 w-3.5" />,
            'Enlace'
          )}

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {toolbarBtn(
            () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            editor.isActive('heading', { level: 1 }),
            <Heading1 className="h-3.5 w-3.5" />,
            'Título 1'
          )}
          {toolbarBtn(
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            editor.isActive('heading', { level: 2 }),
            <Heading2 className="h-3.5 w-3.5" />,
            'Título 2'
          )}

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {toolbarBtn(
            () => editor.chain().focus().toggleBulletList().run(),
            editor.isActive('bulletList'),
            <List className="h-3.5 w-3.5" />,
            'Lista'
          )}
          {toolbarBtn(
            () => editor.chain().focus().toggleBlockquote().run(),
            editor.isActive('blockquote'),
            <Quote className="h-3.5 w-3.5" />,
            'Cita'
          )}
          {toolbarBtn(
            () => editor.chain().focus().toggleCode().run(),
            editor.isActive('code'),
            <Code className="h-3.5 w-3.5" />,
            'Código'
          )}

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Editor area */}
      <div className={`py-4 transition-all duration-200 ${blocksOpen ? 'pl-[328px] pr-6' : 'pl-12 pr-6'}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
