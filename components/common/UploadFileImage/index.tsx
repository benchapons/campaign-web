import { ChangeEventHandler, FC, memo, useState } from 'react';

import { LIMIT_IMG_UPLOAD_MB } from '@/constants/file';
import { ChangeEventFileType } from '@/types/event.interface';
import { validateFileSizeType } from '@/utilities/validate';
import { MdCancelPresentation } from 'react-icons/md';
import { FaRegFileImage } from 'react-icons/fa';
import { BsFiletypeJpg, BsFiletypePng } from 'react-icons/bs';
import { formatBytes } from '@/utilities/format';

import styles from './ShowFileOne.module.css';
import { SwalCustom } from '@/configurations/alert';

interface UploadFileImageProps {
  name: string;
  onChange: (event: ChangeEventFileType<File>) => void;
  onDeleteUploadFile: () => void;
  onDeleteExistedFile: () => void;
  existedFile?: string | null | undefined;
}
const MAP_FILE_ICON: any = {
  'image/png': <BsFiletypePng className="text-[36px] text-theme-primary mr-4" />,
  'image/jpeg': <BsFiletypeJpg className="text-[30px] text-theme-primary mr-4" />,
};

const UploadFileImage: FC<UploadFileImageProps> = ({
  name,
  existedFile,
  onChange,
  onDeleteUploadFile,
  onDeleteExistedFile,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [files, setFiles] = useState<File | null>(null);

  const handleOnChange: ChangeEventHandler<any> = (event) => {
    event.preventDefault();

    if (event?.target?.files) {
      const file = event.target.files[0];

      if (validateFileSizeType(file?.size, file?.type)) {
        onDeleteExistedFile();
        setFiles(file);
        const changeEvent: ChangeEventFileType<File> = {
          name: name,
          value: file,
        };
        onChange?.(changeEvent);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        event.target.value = '';
        event.target.files = null;
        setErrorMsg(`ไม่สามารถ upload file ได้เนื่องจากขนาด file เกิน ${LIMIT_IMG_UPLOAD_MB} MB`);
      }
    }
  };

  const onDeleteFile = () => {
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการลบ file นี้หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteUploadFile();
        setFiles(null);
        setPreviewImage('');
      }
    });
  };

  const handleDeleteExistedFile = () => {
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการลบ file นี้หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteExistedFile();
      }
    });
  };

  return (
    <div id="unit-test-upload" className="flex flex-col">
      <label
        className="py-[6px] px-4 bg-blue-sea text-white rounded-[30px] max-w-[105px] z-10 hover:bg-blue-sea/75 cursor-pointer"
        onChange={handleOnChange}
        htmlFor="formId"
      >
        <input name={name} accept=".jpg, .png, .jpeg, .gif, .bmp" type="file" id="formId" hidden />
        UploadFile
      </label>
      {errorMsg && <div className="row text-red text-sm">{errorMsg}</div>}
      {previewImage && files && (
        <div
          className={`flex flex-col items-center w-full mt-6 ${styles['status-normal']} border-2 border-solid rounded-[6px] max-w-[700px]`}
        >
          <div className={`flex items-center w-full  p-3 min-h-[45px] `}>
            <div className="w-[92%] flex items-center">
              {MAP_FILE_ICON?.[files?.type] || <FaRegFileImage className="text-[30px] text-theme-primary mr-4" />}

              <div className="flex flex-col hover:opacity-80">
                <p className="text-[16px]">
                  {files?.name.substring(
                    0,
                    files?.name.indexOf('#imgid') > -1 ? files?.name.indexOf('#imgid') : files?.name.length
                  ) || ''}
                </p>
                <span className={`text-[14px] text-[#636262]`}>{formatBytes(files?.size || 0)}</span>
              </div>
            </div>

            <div className="w-[8%] flex items-center justify-end">
              <button className="text-[44px] text-theme-pink/100 hover:text-theme-pink/75" onClick={onDeleteFile}>
                <MdCancelPresentation />
              </button>
            </div>
          </div>
          <div>
            <img src={previewImage} className="mt-4 object-cover" />
          </div>
        </div>
      )}
      {existedFile && !previewImage && (
        <div
          className={`flex flex-col items-center w-full mt-6 ${styles['status-normal']} border-2 border-solid rounded-[6px] max-w-[700px]`}
        >
          <div className={`flex items-center w-full  p-3 min-h-[45px] `}>
            <div className="w-[8%] flex items-center justify-end">
              <button
                className="text-[44px] text-theme-pink/100 hover:text-theme-pink/75"
                onClick={handleDeleteExistedFile}
              >
                <MdCancelPresentation />
              </button>
            </div>
          </div>
          <div>
            <img src={existedFile} className="mt-4 object-cover" />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(UploadFileImage);
