import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import Button from '@/components/common/Button';
import { StepProgressBar } from '../components';
import { StatusCampaignEnum } from '@/constants/enum';

interface PropsType {
  textButtonSubmit: string;
  campaignCode: string;
  campaignStatus: string;
  handleClickCancel: () => void;
  handleSaveDraft: () => void;
  handleClickSubmit: () => void;
}

const HeaderCampaignCreate = ({
  campaignCode,
  campaignStatus,
  textButtonSubmit,
  handleClickCancel,
  handleClickSubmit,
  handleSaveDraft,
}: PropsType) => {
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
        {campaignStatus ? (
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-semibold">{campaignCode}</h1>
            <p className="text-gray text-sm ">{campaignStatus === StatusCampaignEnum?.DRAFTED ? 'Draft' : ''}</p>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold">Create Campaign</h1>
        )}
        <div className="flex justify-end gap-4">
          <Button theme="secondary" name="draft-create-campaign" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button name="submit-create-campaign" onClick={handleClickSubmit}>
            {textButtonSubmit}
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-center py-2  border-b border-gray-gainsboro shadow-sm bg-white-ghost/20 px-5">
        <StepProgressBar />
      </div>
    </header>
  );
};

export default HeaderCampaignCreate;
