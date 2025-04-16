
import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTinyMceApiKey } from "@/services/tinyMceService";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

// Fallback API key in case the service fails
const FALLBACK_API_KEY = "sjsagtygodshm478878dcwpawc0wf0cairx5rqlj3kgobssk";

const RichTextEditor = ({ content, onChange, readOnly = false }: RichTextEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>(FALLBACK_API_KEY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await getTinyMceApiKey();
        setApiKey(key);
      } catch (err) {
        console.error("Failed to load TinyMCE API key:", err);
        setError("Using basic editor mode. Some features may be limited.");
        // Still use the fallback key
        setApiKey(FALLBACK_API_KEY);
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
