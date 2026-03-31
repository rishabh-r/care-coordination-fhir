import { marked } from 'marked';

export function simpleMarkdown(text) {
  const parsed = marked.parse(text || "");
  return parsed.replace(/<table>/g, '<div class="table-wrapper"><table>').replace(/<\/table>/g, '</table></div>');
}
