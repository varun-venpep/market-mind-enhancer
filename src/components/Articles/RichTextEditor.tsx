
import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTinyMceApiKey } from '@/services/tinyMceService';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

const RichTextEditor = ({ content, onChange, readOnly = false }: RichTextEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState(content);

  // Update the editor content when the prop changes (for external updates)
  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await getTinyMceApiKey();
        console.log('TinyMCE API Key:', key); // Debug log
        setApiKey(key);
      } catch (err) {
        console.error('Failed to get TinyMCE API key:', err);
        setError('Using basic editor mode. Some features may be limited.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent);
  };

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
        apiKey={apiKey || 'sjsagtygodshm478878dcwpawc0wf0cairx5rqlj3kgobssk'}
        value={editorContent} // Use controlled value instead of initialValue
        onInit={() => setIsLoading(false)}
        init={{
          height: 500,
          menubar: true,
          readonly: readOnly,
          plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image',
            'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks',
            'wordcount', 'fullscreen', 'preview', 'quickbars', 'help',
            'advlist', 'paste', 'code', 'hr'
          ],
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough ' +
            '| link image media table | align lineheight | numlist bullist indent outdent ' +
            '| emoticons charmap | removeformat | help',
          content_style:
            'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
          branding: false,
          promotion: false,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          contextmenu: 'link image table',
          powerpaste_word_import: 'clean',
          powerpaste_html_import: 'clean',
          inline_styles: true,
          paste_data_images: true,
          browser_spellcheck: true,
          paste_text_sticky_default: true,
          paste_as_text: false,
          // Enhanced key actions
          setup: (editor) => {
            editor.on('init', () => {
              console.log("TinyMCE editor initialized");
            });

            // Add undo/redo keyboard shortcuts
            editor.addShortcut('ctrl+z', 'Undo', () => {
              editor.execCommand('Undo');
            });
            
            editor.addShortcut('ctrl+y', 'Redo', () => {
              editor.execCommand('Redo');
            });
            
            editor.addShortcut('meta+z', 'Undo', () => {
              editor.execCommand('Undo');
            });
            
            editor.addShortcut('meta+y', 'Redo', () => {
              editor.execCommand('Redo');
            });
          }
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default RichTextEditor;
