import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Type, Palette, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, minHeight = '140px' }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize initial value or external updates without resetting cursor on user typing
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const execCmd = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 10px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {/* Headings / Format */}
        <select
          onChange={(e) => {
            if (e.target.value) execCmd('formatBlock', e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#fff', cursor: 'pointer' }}
          title="Heading"
        >
          <option value="" disabled>Heading</option>
          <option value="<h1>">Heading 1</option>
          <option value="<h2>">Heading 2</option>
          <option value="<h3>">Heading 3</option>
          <option value="<h4>">Heading 4</option>
          <option value="<p>">Normal Paragraph</option>
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => {
            if (e.target.value) execCmd('fontSize', e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#fff', cursor: 'pointer' }}
          title="Text Size"
        >
          <option value="" disabled>Text Size</option>
          <option value="1">Small (10px)</option>
          <option value="2">Small-Medium (13px)</option>
          <option value="3">Normal (16px)</option>
          <option value="4">Medium (18px)</option>
          <option value="5">Large (24px)</option>
          <option value="6">X-Large (32px)</option>
          <option value="7">XX-Large (48px)</option>
        </select>

        <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />

        {/* Formatting Buttons */}
        <button
          type="button"
          onClick={() => execCmd('bold')}
          title="Bold"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Bold size={15} color="#334155" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('italic')}
          title="Italic"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Italic size={15} color="#334155" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('underline')}
          title="Underline"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Underline size={15} color="#334155" />
        </button>

        <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />

        {/* Text Color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px' }} title="Text Color">
          <Palette size={15} color="#334155" />
          <input
            type="color"
            onChange={(e) => execCmd('foreColor', e.target.value)}
            style={{ width: '22px', height: '22px', border: 'none', cursor: 'pointer', background: 'transparent' }}
          />
        </div>

        {/* Highlight / Background Color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px' }} title="Highlight Color">
          <Type size={15} color="#334155" />
          <input
            type="color"
            defaultValue="#ffffff"
            onChange={(e) => execCmd('hiliteColor', e.target.value)}
            style={{ width: '22px', height: '22px', border: 'none', cursor: 'pointer', background: 'transparent' }}
          />
        </div>

        <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => execCmd('justifyLeft')}
          title="Align Left"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <AlignLeft size={15} color="#334155" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('justifyCenter')}
          title="Align Center"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <AlignCenter size={15} color="#334155" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('justifyRight')}
          title="Align Right"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <AlignRight size={15} color="#334155" />
        </button>

        <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCmd('insertUnorderedList')}
          title="Bullet List"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <List size={15} color="#334155" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('insertOrderedList')}
          title="Numbered List"
          style={{ padding: '5px 8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ListOrdered size={15} color="#334155" />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          minHeight,
          padding: '12px 16px',
          outline: 'none',
          fontSize: '0.95rem',
          color: '#334155',
          lineHeight: 1.6,
          background: '#fff'
        }}
      />
    </div>
  );
};
