
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentTypeSelectorProps {
  contentType: string;
  setContentType: (type: string) => void;
  contentLength: string;
  setContentLength: (length: string) => void;
  tone: string;
  setTone: (tone: string) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentType,
  setContentType,
  contentLength,
  setContentLength,
  tone,
  setTone
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="content-type">Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blog-post">Blog Post</SelectItem>
            <SelectItem value="product-description">Product Description</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="social-media">Social Media Post</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content-length">Content Length</Label>
        <Select value={contentLength} onValueChange={setContentLength}>
          <SelectTrigger>
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short (500-700 words)</SelectItem>
            <SelectItem value="medium">Medium (1000-1200 words)</SelectItem>
            <SelectItem value="long">Long (1500-2000 words)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="informational">Informational</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="persuasive">Persuasive</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ContentTypeSelector;
