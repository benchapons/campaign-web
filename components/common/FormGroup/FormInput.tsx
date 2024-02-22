import { memo, PropsWithChildren } from 'react';

type FormGroupProps = PropsWithChildren<{
  isRequired?: boolean;
  title: string;
  supTitle?: string;
  className?: string;
  testId?: string;
}>;

const FormInput = ({ isRequired, title, supTitle, children, className, testId = '' }: FormGroupProps) => {
  return (
    <div
      className={`flex pb-5 px-4 ${className ? className : ''}`}
      test-id={testId ? `form-group-${testId}` : 'form-group'}
    >
      <div className="flex flex-col w-2/5">
        <label className="text-blue-oxford text-base">
          {title} {isRequired ? <b className="text-red ml-1"> * </b> : null}
        </label>
        {supTitle ? <p className="text-gray-dark text-sm">{supTitle}</p> : null}
      </div>
      <div className="flex flex-col gap-3 w-3/5">{children}</div>
    </div>
  );
};

export default memo(FormInput);
