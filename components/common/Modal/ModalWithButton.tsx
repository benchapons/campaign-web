import { memo } from 'react';
import { GrClose } from 'react-icons/gr';
import Button from '../Button';

interface ModalWithButtonProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  testId?: string;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalWithButton = ({ isOpen, children, title, testId = '', onClose, onSubmit }: ModalWithButtonProps) => {
  return isOpen ? (
    <div test-id={testId ? `modal-${testId}` : 'modal'} className="fixed z-40 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-0 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => onClose()}>
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div
          className="inline-block align-middle  w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-center ">
            <div className="flex flex-col text-black  bg-white rounded z-50 min-w-[500px]">
              <div className="flex justify-between items-baseline px-7 pt-7">
                <div className="text-left text-2xl rounded-t-lg">{title}</div>
                <button
                  test-id={testId ? `btn-close-${testId}` : 'btn-close'}
                  className="flex border border-gray-sliver p-1"
                  onClick={onClose}
                >
                  <GrClose />
                </button>
              </div>
              <div className="text-left p-7">{children}</div>
              <div className="flex justify-center gap-2 pb-5 px-7">
                <Button
                  theme="secondary"
                  name="modal-cancel"
                  testId={testId ? `cancel-${testId}` : 'cancel'}
                  onClick={onClose}
                >
                  ยกเลิก
                </Button>
                <Button name="modal-submit" testId={testId ? `submit-${testId}` : 'submit'} onClick={onSubmit}>
                  บันทึก
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default memo(ModalWithButton);
