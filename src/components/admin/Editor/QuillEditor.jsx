import React from 'react';
import QuillWrapper, { Quill } from '../../../utils/quillFix.jsx';
import 'react-quill/dist/quill.snow.css'; // Using the snow theme
import './QuillEditor.css'; // Custom styles for light theme

// Add justify alignment to the editor
const Align = Quill.import('attributors/style/align');
Quill.register(Align, true);

const QuillEditor = ({ value, onChange, placeholder, isRTL }) => {
  const modules = {
    toolbar: {
      container: isRTL 
        ? [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'link'],
            [{ 'align': 'right' }, { 'align': 'center' }, { 'align': 'justify' }],
            ['clean']
          ]
        : [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'link'],
            [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
            ['clean']
          ],
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'link',
    'align'
  ];

  return (
    <div className="quill-editor-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <QuillWrapper
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        isRTL={isRTL}
      />
    </div>
  );
};

export default QuillEditor; 