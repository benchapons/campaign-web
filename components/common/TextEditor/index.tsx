import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
// import { Editor } from 'react-draft-wysiwyg';
import { convertFromHTML } from 'draft-js';
import { useFormContext } from 'react-hook-form';
import { convertToHTML } from 'draft-convert';
import { ContentState, EditorState } from 'draft-js';
import { useEffect, useState } from 'react';
const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ChangeEventBaseNumberType, ChangeEventBaseType } from '@/types/event.interface';

import { resolveName } from '@/utilities/format';

type PropsType = {
  isRequired?: boolean;
  disabled?: boolean;
  label?: string;
  desc?: string;
  className?: string;
  value: string;
  name: string;
  id?: string;
  placeholder?: string;
  errWarning?: string;
  maxLength?: number;
  decimal?: number;
  testId?: string;
  onChange?: (data: ChangeEventBaseNumberType<string>) => void;
};

const TextEditor = ({ name, value, testId, label, id, isRequired, desc, disabled, onChange }: PropsType) => {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // const field = register(name);

  useEffect(() => {
    if (!value) return setEditorState(EditorState.createEmpty());
    if (isFirstTime) return;
    const blocksFromHTML = convertFromHTML(value);
    const { contentBlocks, entityMap } = blocksFromHTML;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    setEditorState(editorState);
    setIsFirstTime(true);
  }, [value]);

  const handleOnChange = (event: any) => {
    const isEmpty =
      editorState.getCurrentContent().hasText() && editorState.getCurrentContent().getPlainText().length > 0;
    setEditorState(event);
    const valueHtml = convertToHTML(event.getCurrentContent());

    const changeEvent: ChangeEventBaseType<string> = {
      name: name || '',
      value: isEmpty ? valueHtml?.toString() : '',
    };
    onChange?.(changeEvent);
    register(name)?.onChange({
      type: 'change',
      target: {
        name,
        value: isEmpty ? valueHtml?.toString() : '',
      },
    });
  };

  return (
    <div className="flex flex-col" test-id={testId ? `text-input-${testId}` : 'text-input'}>
      {label ? (
        <div className="flex justify-between">
          <label htmlFor={id} className="py-1">
            {label}
            {isRequired ? <b className="text-red ml-0.5"> * </b> : null}
          </label>
          {desc ? <p className="text-orange-tangerine">{desc}</p> : null}
        </div>
      ) : null}
      <div
        className={`flex flex-col rounded-md border ${
          resolveName(name, errors)?.message ? 'border-red border-2' : ''
        } ${
          disabled
            ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
            : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
        }`}
      >
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorStyle={{ height: '160px'}}
          readOnly={disabled}
          toolbar={{
            options: ['inline', 'list', 'textAlign', 'history'],
          }}
          onEditorStateChange={handleOnChange}
        />
      </div>
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default TextEditor;
