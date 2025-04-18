
import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTinyMceApiKey } from '@/services/tinyMceService';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

const RichTextEditor = ({ content, onChange, readOnly = true }: RichTextEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="min-h-[400px] rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] rounded-md border" style={{ zIndex: 1 }}>
      {error && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-2 mb-2 rounded-md text-sm">
          {error}
        </div>
      )}
      <Editor
        apiKey='sjsagtygodshm478878dcwpawc0wf0cairx5rqlj3kgobssk'
        initialValue={content}
        onInit={() => setIsLoading(false)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image',
            'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks',
            'wordcount', 'fullscreen', 'preview', 'quickbars', 'help',
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
          fixed_toolbar_container: 'tinymce-toolbar',
          // Add z-index to make sure dropdowns appear above other elements
          inline_styles: true,
          setup: (editor) => {
            editor.on('init', () => {
              // Set high z-index for TinyMCE UI elements to appear above other elements
              const iframes = document.querySelectorAll('.tox-tinymce-aux, .tox-tinymce');
              iframes.forEach(iframe => {
                if (iframe instanceof HTMLElement) {
                  iframe.style.zIndex = '9999';
                }
              });
            });
          }
        }}
        onEditorChange={onChange}
      />
    </div>
  );
};

export default RichTextEditor;
