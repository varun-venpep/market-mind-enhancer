
import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTinyMceApiKey } from "@/services/tinyMceService";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

const RichTextEditor = ({ content, onChange, readOnly = false }: RichTextEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await getTinyMceApiKey();
        setApiKey(key);
      } catch (err) {
        console.error("Failed to load TinyMCE API key:", err);
        setError("Using basic editor mode. Some features may be limited.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[400px] rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] rounded-md border">
      {error && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-2 mb-2 rounded-md text-sm">
          {error}
        </div>
      )}
      <Editor
        apiKey={apiKey}
        initialValue={content}
        value={content}
        onInit={() => setIsLoading(false)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            // Core editing features
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 
            'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 
            'wordcount', 'fullscreen', 'preview', 'quickbars', 'help',
            // Premium features
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed',
            'permanentpen', 'advtable', 'advcode', 'editimage', 'advtemplate',
            'mentions', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect',
            'typography', 'inlinecss', 'markdown'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough ' +
                  '| link image media table mergetags | spellcheckdialog typography ' +
                  '| align lineheight | checklist numlist bullist indent outdent ' +
                  '| emoticons charmap | removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
          branding: false,
          promotion: false,
          readonly: readOnly,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          contextmenu: 'link image table',
          powerpaste_word_import: 'clean',
          powerpaste_html_import: 'clean',
          setup: (editor) => {
            editor.on('change', () => {
              onChange(editor.getContent());
            });
          }
        }}
        onEditorChange={onChange}
        disabled={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;
