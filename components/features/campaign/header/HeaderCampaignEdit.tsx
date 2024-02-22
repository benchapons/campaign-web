import { useMemo } from 'react';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

import Button from '@/components/common/Button';
import { StepProgressBar } from '../components';
import { FormStatusEnum, StatusCampaignEnum } from '@/constants/enum';

interface PropsType {
  isShowBtnDraft: boolean;
  isShowBtnNext: boolean;
  isShowBtnSubmit: boolean;
  textButtonSubmit: string;
  campaignCode: string;
  campaignStatus: string;
  campaignStarting: boolean;
  campaignEnded: boolean;
  handleClickCancel: () => void;
  handleSaveDraft: () => void;
  handleClickNext: () => void;
  handleClickSubmit: () => void;
}

const HeaderCampaignEdit = ({
  isShowBtnNext,
  isShowBtnDraft,
  isShowBtnSubmit,
  campaignCode,
  campaignStatus,
  campaignStarting,
  campaignEnded,
  textButtonSubmit,
  handleClickCancel,
  handleClickNext,
  handleClickSubmit,
  handleSaveDraft,
}: PropsType) => {
  const status = useMemo(() => {
    if (campaignStatus === FormStatusEnum?.DRAFTED) return 'Draft';
    if (campaignStatus === FormStatusEnum?.SUBMITTED && !campaignStarting && !campaignEnded) return 'Submit';
    if (campaignEnded) return 'Ended';
    if (campaignStarting) return 'Active';
  }, [campaignStatus, campaignEnded, campaignStarting]);
  return (
    <header>
      <div className="flex justify-between items-center px-5 pt-3 pb-2 border-b border-gray-gainsboro/50 shadow-sm bg-white-ghost/50">
        <div
          test-id="back-to-campaign"
          className="flex items-center hover:cursor-pointer hover:bg-blue-fresh/30 py-1 pr-2 rounded-md ease-in duration-150"
          onClick={handleClickCancel}
        >
          <MdOutlineKeyboardArrowLeft className="text-2xl text-blue-pacific font-bold" />
          <p className="text-gray-dim">Back to Campaign</p>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold">{campaignCode}</h1>
          <p className="text-gray text-sm ">{status}</p>
        </div>
        <div className="flex justify-end gap-4">
          {isShowBtnDraft ? (
            <Button name="draft-edit-campaign" theme="secondary" onClick={handleSaveDraft}>
              Save Draft
            </Button>
          ) : null}
          {isShowBtnNext ? (
            <Button name="next-edit-campaign" onClick={handleClickNext}>
              Next
            </Button>
          ) : isShowBtnSubmit ? (
            <Button name="submit-edit-campaign" onClick={handleClickSubmit}>
              {textButtonSubmit}
            </Button>
          ) : (
            <div className="opacity-0 min-w-[120px]">xx</div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-center py-2  border-b border-gray-gainsboro shadow-sm bg-white-ghost/20 px-5">
        <StepProgressBar />
      </div>
    </header>
  );
};

export default HeaderCampaignEdit;
