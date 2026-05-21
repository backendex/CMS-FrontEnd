import React, { useState, useEffect } from "react";
import { useYoastAnalysis } from "@/features/blog/hooks/useYoastAnalyst";
import { BlogPost, BlogFormProps } from "@/features/blog/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  ChevronDown,
  Settings2,
  Eye,
  Globe,
  Calendar,
  User,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Link2,
  ExternalLink,
  Save,
  Trash2,
  Info,
  Folder,
  FileText,
  ShieldCheck,
  Smile,
  Frown,
  Monitor,
  Tablet,
  Smartphone,
  Check,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { GooglePreview } from "@/features/blog/components/googlePreview";
import { MediaLibraryDialog } from "@/features/blog/components/mediaLibraryDialog";
import { RichTextEditor } from "@/components/shared/richTextEditor";
import { PostPreviewModal } from "@/features/blog/components/postPreviewModal";

type PreviewDevice = "desktop" | "tablet" | "mobile";

const SidebarSection = ({
  id,
  title,
  icon: Icon,
  children,
  activeAccordion,
  toggleAccordion
}: {
  id: string,
  title: string,
  icon: any,
  children: React.ReactNode,
  activeAccordion: string[],
  toggleAccordion: (id: string) => void
}) => (
  <div className="border-b border-border/40 last:border-0">
    <button
      type="button"
      onClick={() => toggleAccordion(id)}
      className="w-full flex items-center justify-between px-4 py-4 text-sm font-bold hover:bg-muted/50 transition-all group"
    >
      <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
        <Icon className="w-4 h-4" />
        <span className="tracking-tight">{title}</span>
      </div>
      <div className="text-muted-foreground/50">
        {activeAccordion.includes(id) ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </div>
    </button>
    {activeAccordion.includes(id) && (
      <div className="px-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
        {children}
      </div>
    )}
  </div>
);

export const BlogForm: React.FC<BlogFormProps & { isLoading?: boolean }> = ({
  initialData,
  onSubmit,
  onDelete,
  previewUrl,
  isSubmitting,
  isLoading,
}) => {
  const { toast } = useToast();
  const loading = isSubmitting || isLoading;
  const defaultPost: BlogPost = {
    id: 0,
    postTitle: "",
    postName: "",
    postContent: "",
    siteId: "",
    tableName: "",
    postExcerpt: "",
    postStatus: "draft",
    postAuthor: 1,
    postDate: new Date().toISOString(),
    postDateGmt: new Date().toISOString(),
    postModified: new Date().toISOString(),
    postModifiedGmt: new Date().toISOString(),
    commentStatus: "open",
    pingStatus: "open",
    postType: "post",
    postParent: 0,
    guid: "",
    menuOrder: 0,
    commentCount: 0,
    postMimeType: "",
    seoData: {
      seoTitle: "",
      metaDescription: "",
      focusKeyword: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      isCornerstone: false,
      allowSearch: true,
      followLinks: true,
      metaRobotsAdvanced: "",
      breadcrumbsTitle: "",
    },
    schemaMarkup: "",
  };

  const [post, setPost] = useState<BlogPost>(
    initialData ? { ...defaultPost, ...initialData, seoData: initialData.seoData || defaultPost.seoData } : defaultPost
  );

  // editorRef holds the TipTap editor instance (set by RichTextEditor via its editorRef prop)
  const editorRef = React.useRef<any>(null);
  const isInternalUpdate = React.useRef(false);

  // Sync initialData if it changes (useful for edit page)
  useEffect(() => {
    if (initialData) {
      const updatedPost = {
        ...defaultPost,
        ...initialData,
        seoData: initialData.seoData || defaultPost.seoData
      };
      setPost(updatedPost);

      // Update TipTap editor content when data is loaded from outside
      if (editorRef.current) {
        editorRef.current.commands.setContent(updatedPost.postContent || "");
      }
    }
  }, [initialData?.id]); // Only sync when the ID changes to avoid loops during typing

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string[]>(["status", "categories", "image"]);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const seoScore = useYoastAnalysis(
    post.postContent,
    post.postTitle,
    post.seoData,
  );

  const handleSeoChange = (field: string, value: any) => {
    setPost({ ...post, seoData: { ...post.seoData, [field]: value } });
  };

  const buildSlug = () =>
    post.postName ||
    post.postTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSubmit = () => {
    onSubmit({ ...post, postName: buildSlug(), postStatus: "publish" });
  };

  const handleSaveDraft = () => {
    onSubmit({ ...post, postName: buildSlug(), postStatus: "draft" });
  };

  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreviewInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    } else if (post.postName) {
      window.open(`/blog/${post.postName}`, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Preview not available",
        description: "Save the draft first to preview the post.",
        variant: "destructive",
      });
    }
  };

  const deviceOptions: { value: PreviewDevice; label: string; icon: React.ReactNode }[] = [
    { value: "desktop", label: "Desktop",  icon: <Monitor className="w-4 h-4" /> },
    { value: "tablet",  label: "Tablet",   icon: <Tablet className="w-4 h-4" /> },
    { value: "mobile", label: "Mobile",   icon: <Smartphone className="w-4 h-4" /> },
  ];

  const PreviewDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
          <Monitor className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {deviceOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => { setPreviewDevice(opt.value); setPreviewOpen(true); }}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {opt.icon}
              {opt.label}
            </span>
            {previewDevice === opt.value && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePreviewInNewTab} className="text-primary flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Preview in new tab
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
    if (onDelete) {
      onDelete();
    } else {
      toast({
        title: "Error deleting",
        description: "Cannot delete: this post has not been saved yet.",
        variant: "destructive",
      });
    }
  };

  const ActionButtons = (
    <div className="flex items-center gap-2">
      <Button type="button" variant="ghost" size="sm" className="hidden sm:flex gap-1.5" onClick={handleSaveDraft} disabled={loading}>
        <Save className="w-4 h-4" />
        Save draft
      </Button>
      {PreviewDropdown}
      <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm px-6 font-bold"
      >
        {loading ? "..." : (post.id ? "Update" : "Publish")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          "h-9 w-9 rounded-md",
          sidebarOpen ? "text-primary bg-primary/10" : ""
        )}
      >
        <Settings2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <>
    <div className="flex flex-col bg-background h-full">
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background custom-scrollbar">
          <div className="max-w-[900px] mx-auto py-12 px-8 lg:px-16 space-y-12">
            {/* Action Bar Inline */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Content Editor
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground" onClick={handleSaveDraft} disabled={loading}>
                  <Save className="w-4 h-4" />
                  Draft
                </Button>
                {PreviewDropdown}
                <Separator orientation="vertical" className="h-6 mx-2" />
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-black text-white hover:bg-black/90 shadow-md px-8 font-bold"
                >
                  {loading ? "..." : (post.id ? "Update" : "Publish")}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MediaLibraryDialog 
                  onSelect={(url) => {
                      editorRef.current && (editorRef.current as any).chain().focus().setImage({ src: url }).run();
                  }}
                  trigger={
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Insert from Library
                    </Button>
                  }
                />
                <span className="text-[10px] text-muted-foreground italic">Select files from your media library</span>
              </div>
              <Input
                className="text-5xl font-bold h-auto py-4 border-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/20 bg-transparent px-0 tracking-tight"
                placeholder="Write the title here..."
                value={post.postTitle || ""}
                onChange={(e) => setPost({ ...post, postTitle: e.target.value })}
              />

              <div className="flex items-center gap-2 text-xs text-muted-foreground group cursor-pointer hover:text-foreground transition-colors">
                <Link2 className="w-3 h-3" />
                <span>Permalink:</span>
                <span className="font-mono bg-muted/50 px-1 rounded">{post.postName || "auto-generated"}</span>
              </div>
            </div>

            <div className="min-h-[500px]">
              <RichTextEditor
                content={post.postContent}
                onChange={(content) => {
                  isInternalUpdate.current = true;
                  setPost(prev => ({ ...prev, postContent: content }));
                }}
                editorRef={editorRef}
              />
            </div>

            <Separator className="my-20 opacity-50" />

            <Card className="border-none shadow-xl shadow-primary/5 mb-24 overflow-hidden bg-white dark:bg-slate-950">
              <CardHeader className="bg-muted/20 border-b py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2.5">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  Yoast SEO
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2 px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider",
                      seoScore.points >= 70
                        ? 'border-green-500/50 text-green-600 bg-green-50'
                        : seoScore.points >= 40
                          ? 'border-orange-500/50 text-orange-600 bg-orange-50'
                          : 'border-red-500/50 text-red-600 bg-red-50'
                    )}
                  >
                    {seoScore.points >= 70 ? 'Good' : seoScore.points >= 40 ? 'Needs Improvement' : 'Poor'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="seo" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                    <TabsTrigger
                      value="seo"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      {seoScore.points >= 70 ? (
                        <Smile className="w-4 h-4 text-green-500" />
                      ) : (
                        <Frown className="w-4 h-4 text-red-500" />
                      )}
                      SEO
                    </TabsTrigger>
                    <TabsTrigger
                      value="readability"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      <Smile className="w-4 h-4 text-green-500" />
                      Readability
                    </TabsTrigger>
                    <TabsTrigger
                      value="schema"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Schema
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Social
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="seo" className="p-6 space-y-8">
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Google Preview</Label>
                      <div className="bg-white dark:bg-slate-900 border rounded-lg p-6 shadow-sm">
                        <GooglePreview
                          title={post.seoData.seoTitle || post.postTitle}
                          slug={post.postName}
                          description={post.seoData.metaDescription}
                          siteDomain="yoursite.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 max-w-2xl">
                      <div className="space-y-2">
                        <Label htmlFor="keyword" className="text-sm font-medium">Focus keyword</Label>
                        <Input
                          id="keyword"
                          placeholder="Enter your focus keyword..."
                          value={post.seoData.focusKeyword}
                          onChange={(e) => handleSeoChange("focusKeyword", e.target.value)}
                          className="bg-muted/20"
                        />
                        <p className="text-[11px] text-muted-foreground">Helps optimize your content for this specific word.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seoTitle" className="text-sm font-medium">SEO Title</Label>
                        <Input
                          id="seoTitle"
                          value={post.seoData.seoTitle}
                          onChange={(e) => handleSeoChange("seoTitle", e.target.value)}
                          className="bg-muted/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta" className="text-sm font-medium">Meta description</Label>
                        <Textarea
                          id="meta"
                          rows={3}
                          value={post.seoData.metaDescription}
                          onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
                          className="bg-muted/20 resize-none"
                        />
                      </div>
                    </div>
                    
                    {/* DETAILED ANALYSIS RESULTS */}
                    <div className="space-y-6 pt-6">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold">Analysis results</h3>
                        <Badge variant="outline" className="text-[10px]">{seoScore.checks.length} results</Badge>
                      </div>

                      <div className="space-y-6">
                        {/* Problems */}
                        {seoScore.checks.filter(c => c.status === 'problem').length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                              <ChevronDown className="w-4 h-4" />
                              Problems ({seoScore.checks.filter(c => c.status === 'problem').length})
                            </div>
                            <div className="space-y-3 pl-6">
                              {seoScore.checks.filter(c => c.status === 'problem').map(check => (
                                <div key={check.id} className="flex gap-3">
                                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                                  <div className="text-sm">
                                    <span className="font-bold border-b border-muted-foreground/30 mr-1">{check.label}:</span>
                                    <span className="text-muted-foreground">{check.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Improvements / OK */}
                        {seoScore.checks.filter(c => c.status === 'ok').length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-orange-600">
                              <ChevronDown className="w-4 h-4" />
                              Improvements ({seoScore.checks.filter(c => c.status === 'ok').length})
                            </div>
                            <div className="space-y-3 pl-6">
                              {seoScore.checks.filter(c => c.status === 'ok').map(check => (
                                <div key={check.id} className="flex gap-3">
                                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0" />
                                  <div className="text-sm">
                                    <span className="font-bold border-b border-muted-foreground/30 mr-1">{check.label}:</span>
                                    <span className="text-muted-foreground">{check.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Good Results */}
                        {seoScore.checks.filter(c => c.status === 'good').length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                              <ChevronDown className="w-4 h-4" />
                              Good results ({seoScore.checks.filter(c => c.status === 'good').length})
                            </div>
                            <div className="space-y-3 pl-6">
                              {seoScore.checks.filter(c => c.status === 'good').map(check => (
                                <div key={check.id} className="flex gap-3">
                                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                                  <div className="text-sm">
                                    <span className="font-bold border-b border-muted-foreground/30 mr-1">{check.label}:</span>
                                    <span className="text-muted-foreground">{check.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="readability" className="p-6 space-y-6">
                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 flex gap-3">
                      <div className="bg-green-500 w-3 h-3 rounded-full mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-green-800">Excellent Readability!</h4>
                        <p className="text-xs text-green-700">Your text is easy to read and follows writing best practices.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <ChevronDown className="w-4 h-4" />
                        Good results (6)
                      </div>
                      <div className="space-y-3 pl-6">
                        {[
                          { label: 'Passive voice', desc: 'You are not using too much passive voice! That is great!' },
                          { label: 'Consecutive sentences', desc: 'There are no repetitions at the start of sentences. Great!' },
                          { label: 'Subheading distribution', desc: 'You are using subheadings correctly to break up the text.' },
                          { label: 'Paragraph length', desc: 'No paragraphs are too long! Good job!' },
                          { label: 'Sentence length', desc: 'Great!' },
                          { label: 'Transition words', desc: 'You are using enough transition words!' },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                            <div className="text-sm">
                              <span className="font-bold border-b border-muted-foreground/30 mr-1">{item.label}:</span>
                              <span className="text-muted-foreground">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="schema" className="p-6 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold">Schema Markup (JSON-LD)</h4>
                      <p className="text-xs text-muted-foreground">
                        Add structured data to improve appearance in search results.
                        Paste your <code className="bg-muted px-1 py-0.5 rounded text-[11px]">&lt;script type="application/ld+json"&gt;</code> code here.
                      </p>
                    </div>

                    {/* Code editor area */}
                    <div className="rounded-lg border overflow-hidden bg-slate-950">
                      {/* Toolbar like WordPress HTML block */}
                      <div className="flex items-center gap-1 px-3 py-2 bg-slate-900 border-b border-slate-700">
                        <span className="text-[11px] font-bold text-white bg-slate-700 px-2 py-0.5 rounded">HTML</span>
                        <div className="flex-1" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-slate-400 hover:text-white hover:bg-slate-700"
                          onClick={() => {
                            // Auto-format JSON inside script tag
                            try {
                              const raw = post.schemaMarkup || '';
                              const jsonMatch = raw.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
                              if (jsonMatch) {
                                const formatted = JSON.stringify(JSON.parse(jsonMatch[1]), null, 2);
                                setPost({ ...post, schemaMarkup: `<script type="application/ld+json">\n${formatted}\n</script>` });
                              }
                            } catch { /* ignore parse errors */ }
                          }}
                        >
                          Format
                        </Button>
                      </div>

                      {/* Code textarea */}
                      <textarea
                        value={post.schemaMarkup || ''}
                        onChange={(e) => setPost({ ...post, schemaMarkup: e.target.value })}
                        placeholder={`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Article Title",\n  "author": {\n    "@type": "Person",\n    "name": "Author"\n  }\n}\n</script>`}
                        className="w-full min-h-[300px] p-4 bg-slate-950 text-green-400 font-mono text-sm leading-relaxed resize-y focus:outline-none placeholder:text-slate-600"
                        spellCheck={false}
                      />
                    </div>

                    {/* Quick templates */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quick templates</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Article', type: 'Article' },
                          { label: 'FAQ', type: 'FAQPage' },
                          { label: 'HowTo', type: 'HowTo' },
                          { label: 'Product', type: 'Product' },
                        ].map((tpl) => (
                          <Button
                            key={tpl.type}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              const templates: Record<string, string> = {
                                Article: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "${post.postTitle || 'Title'}",\n  "author": {\n    "@type": "Person",\n    "name": "Admin"\n  },\n  "datePublished": "${new Date().toISOString().split('T')[0]}",\n  "description": "${post.seoData?.metaDescription || ''}"\n}\n</script>`,
                                FAQPage: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "Example question?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Example answer."\n      }\n    }\n  ]\n}\n</script>`,
                                HowTo: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "HowTo",\n  "name": "${post.postTitle || 'Guide'}",\n  "step": [\n    {\n      "@type": "HowToStep",\n      "name": "Step 1",\n      "text": "Description of step 1"\n    }\n  ]\n}\n</script>`,
                                Product: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "${post.postTitle || 'Product'}",\n  "description": "${post.seoData?.metaDescription || ''}",\n  "offers": {\n    "@type": "Offer",\n    "price": "0",\n    "priceCurrency": "USD"\n  }\n}\n</script>`
                              };
                              setPost({ ...post, schemaMarkup: templates[tpl.type] || '' });
                            }}
                          >
                            {tpl.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="p-6 space-y-6">
                    <div className="space-y-4 max-w-2xl">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Social image</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={post.postMimeType}
                            onChange={(e) => setPost({ ...post, postMimeType: e.target.value })}
                            className="bg-muted/20"
                          />
                          <Button variant="secondary">Choose</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>

        {sidebarOpen && (
          <aside className="w-[350px] lg:w-[400px] border-l bg-background overflow-y-auto hidden md:block shadow-xl">
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-background h-12 p-0 px-4 gap-6" variant="line">
                <TabsTrigger value="post" className="rounded-none h-12 px-0 text-xs font-bold uppercase tracking-wider">
                  Post
                </TabsTrigger>
                <TabsTrigger value="block" className="rounded-none h-12 px-0 text-xs font-bold uppercase tracking-wider opacity-50 data-[state=active]:opacity-100">
                  Block
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="m-0 border-none pb-10">
                <SidebarSection id="status" title="Summary" icon={Info} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>Visibility</span>
                      </div>
                      <span className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">Public</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Publish</span>
                      </div>
                      <span className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">Immediately</span>
                    </div>

                    <div className="flex flex-col gap-2 py-3">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        <span className="font-semibold text-xs">Permalink</span>
                      </div>
                      <div className="font-mono text-[11px] break-all text-primary bg-muted/30 p-2 rounded-md border border-border/50">
                        {post.postName || "auto-generated"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Author</span>
                      </div>
                      <span className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">Admin User</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Status</span>
                      </div>
                      <Badge variant={post.postStatus === 'publish' ? 'default' : 'secondary'} className="rounded-md px-2 py-0.5 text-[10px] font-bold">
                        {post.postStatus === 'publish' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="my-4 opacity-50" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive justify-start h-12 px-4 gap-3 font-bold border border-destructive/10 hover:border-destructive/30 transition-all rounded-xl mt-2 shadow-sm bg-destructive/[0.02]"
                    onClick={handleDelete}
                    disabled={!onDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                    {onDelete ? "Move to trash" : "Save first to delete"}
                  </Button>
                </SidebarSection>

                <SidebarSection id="categories" title="Categories" icon={Folder} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <div className="space-y-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {["Cancun & Riviera Maya Guide", "Eco Tourism", "Marine Life", "Snorkeling", "Tips"].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group">
                        <div className="w-3.5 h-3.5 rounded border border-border group-hover:border-primary transition-colors bg-background" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 h-8 text-[11px] font-bold uppercase tracking-wider">
                    + Add new category
                  </Button>
                </SidebarSection>

                <SidebarSection id="image" title="Featured image" icon={ImageIcon} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  {post.seoData?.ogImage ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border group/img">
                        <img 
                          src={post.seoData.ogImage} 
                          alt="Featured" 
                          className="w-full h-full object-cover transition-transform group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <MediaLibraryDialog 
                            onSelect={(url) => setPost(prev => ({
                              ...prev,
                              seoData: { ...prev.seoData, ogImage: url }
                            }))}
                            trigger={
                              <Button size="sm" className="h-8 px-3">Change</Button>
                            }
                          />
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8 px-3"
                            onClick={() => setPost(prev => ({
                              ...prev,
                              seoData: { ...prev.seoData, ogImage: "" }
                            }))}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-lg border border-dashed border-border flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                        <MediaLibraryDialog 
                          onSelect={(url) => setPost(prev => ({
                            ...prev,
                            seoData: { ...prev.seoData, ogImage: url }
                          }))}
                          trigger={
                            <div className="flex flex-col items-center">
                              <ImageIcon className="w-5 h-5 text-muted-foreground mb-2" />
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select from Library</span>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  )}
                </SidebarSection>

                <SidebarSection id="excerpt" title="Excerpt" icon={FileText} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <Textarea
                    placeholder="Write a brief excerpt..."
                    className="text-xs bg-background min-h-[100px] border-border focus-visible:ring-primary/20 rounded-md resize-none leading-relaxed"
                    value={post.postExcerpt}
                    onChange={(e) => setPost({ ...post, postExcerpt: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground/70 mt-2 italic leading-relaxed">Excerpts are optional hand-crafted summaries.</p>
                </SidebarSection>

                <SidebarSection id="seo-summary" title="SEO Status" icon={ShieldCheck} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Score</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        {seoScore.points >= 70 ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <AlertCircle className="w-3.5 h-3.5 text-orange-500" />}
                        <span className={seoScore.points >= 70 ? 'text-green-600' : 'text-orange-600'}>{seoScore.points}/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${seoScore.points}%`, backgroundColor: seoScore.color }} 
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground italic leading-relaxed text-center opacity-70">
                      "{seoScore.message}"
                    </p>
                  </div>
                </SidebarSection>
              </TabsContent>

              <TabsContent value="block" className="m-0 p-6 text-center text-sm text-muted-foreground">
                No block selected.
              </TabsContent>
            </Tabs>
          </aside>
        )}
      </div>
    </div>

    {previewOpen && (
      <PostPreviewModal
        post={post}
        device={previewDevice}
        onDeviceChange={setPreviewDevice}
        onClose={() => setPreviewOpen(false)}
      />
    )}
    </>
  );
};
