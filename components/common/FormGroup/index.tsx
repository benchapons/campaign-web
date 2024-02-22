import { memo, PropsWithChildren } from 'react';

type FormGroupProps = PropsWithChildren<{
  isHiddenBorder?: boolean;
  isRequired?: boolean;
  title: string;
  supTitle?: string;
}>;

const FormGroup = ({ isHiddenBorder, isRequired, title, supTitle, children }: FormGroupProps) => {
  return (
    <div className={`w-full flex pb-5 px-4 ${isHiddenBorder ? '' : 'border-t border-gray-gainsboro pt-5'}`}>
      <div className="flex flex-col min-w-[18rem]">
        <label className="text-blue-oxford text-base">
          {title} {isRequired ? <b className="text-red ml-1"> * </b> : null}
        </label>
        {supTitle ? <p className="text-gray-dark text-sm whitespace-pre">{supTitle}</p> : null}
      </div>
      <div className="w-full flex flex-col gap-3">{children}</div>
    </div>
  );
};

export default memo(FormGroup);
