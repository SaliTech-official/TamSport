import React, { useRef, useEffect, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import { Quill } from 'react-quill';

/**
 * Custom wrapper for ReactQuill to fix findDOMNode issues in React 18/19
 * This wrapper uses refs instead of findDOMNode which is deprecated
 */
const QuillWrapper = forwardRef(({ value, onChange, modules, formats, placeholder, theme = 'snow', readOnly = false, isRTL = false, ...rest }, ref) => {
  const editorRef = useRef(null);
  
  // Expose the editor instance to parent components via ref
  useEffect(() => {
    if (ref && editorRef.current) {
      // Expose the editor instance and helper methods
      ref.current = {
        getEditor: () => editorRef.current?.getEditor(),
        getContents: () => editorRef.current?.getEditor()?.getContents(),
        setContents: (delta) => editorRef.current?.getEditor()?.setContents(delta),
        focus: () => editorRef.current?.focus(),
      };
    }
    
    return () => {
      if (ref) ref.current = null;
    };
  }, [ref, editorRef]);

  // Set the direction on the editor root element
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      if (editor && editor.root) {
        editor.root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      }
    }
  }, [isRTL]);


  return (
    <div className="quill-editor-wrapper">
      <ReactQuill
        ref={editorRef}
        theme={theme}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        {...rest}
      />
    </div>
  );
});

QuillWrapper.displayName = 'QuillWrapper';

// Re-export Quill for convenience
export { Quill };
export default QuillWrapper; 