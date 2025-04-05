import { format } from 'date-fns';

export const formatDate = (isoString: string): string => {
  return format(new Date(isoString), 'dd MMMM yyyy');
};

function renderText(textNode: any): string {
  let text = textNode.text || '';

  if (textNode.bold) {
    text = `<strong>${text}</strong>`;
  }
  if (textNode.italic) {
    text = `<em>${text}</em>`;
  }
  if (textNode.underline) {
    text = `<u>${text}</u>`;
  }
  if (textNode.strikethrough) {
    text = `<s>${text}</s>`;
  }

  return text;
}

function renderNode(node: any): string {
  if (node.type === 'paragraph') {
    return `<p>${node.children.map(renderText).join('')}</p>`;
  }

  if (node.type === 'heading') {
    const level = node.level >= 1 && node.level <= 6 ? node.level : 2;
    return `<h${level}>${node.children.map(renderText).join('')}</h${level}>`;
  }

  if (node.type === 'list') {
    const tag = node.format === 'ordered' ? 'ol' : 'ul';
    return `<${tag}>${node.children.map(renderNode).join('')}</${tag}>`;
  }

  if (node.type === 'list-item') {
    return `<li>${node.children.map(renderText).join('')}</li>`;
  }

  if (node.type === 'blockquote') {
    return `<blockquote>${node.children.map(renderText).join('')}</blockquote>`;
  }

  if (node.type === 'link') {
    return `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${node.children.map(renderText).join('')}</a>`;
  }

  if (node.type === 'image') {
    return `<img src="${node.url}" alt="${node.alt || ''}" loading="lazy" />`;
  }

  if (node.type === 'code') {
    return `<pre><code>${node.text}</code></pre>`;
  }

  return '';
}

export function strapiRichTextToHtml(content: any[]): string {
  return content.map((node) => renderNode(node)).join('');
}

export const isValidEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

export const isValidPhone = (phone: string) => /^\d{10}$/.test(phone);
