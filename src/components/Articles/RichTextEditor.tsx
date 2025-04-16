
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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await getTinyMceApiKey();
        setApiKey(key);
      } catch (err) {
        console.error("Failed to load TinyMCE API key:", err);
        setError("Failed to load editor. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  if (error) {
    return (
      <div className="min-h-[400px] rounded-md border p-4 bg-red-50">
        <p className="text-red-500">{error}</p>
        <textarea
          className="w-full h-[350px] p-2 mt-2 border rounded-md"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
        />
      </div>
    );
  }

  if (isLoading || !apiKey) {
    return (
      <div className="min-h-[400px] rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] rounded-md border">
      <Editor
        apiKey={apiKey}
        value={content}
        onInit={() => setIsLoading(false)}
        init={{
          height: 500,
          menubar: !readOnly,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: readOnly ? false : 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
          branding: false,
          promotion: false,
          readonly: readOnly,
        }}
        onEditorChange={onChange}
        disabled={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;
