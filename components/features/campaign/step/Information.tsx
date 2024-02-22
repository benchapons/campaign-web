import dynamic from 'next/dynamic';
import { DateObject } from 'react-multi-date-picker';

import { DatePicker } from '@/components/common/DatePicker';
import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import TextArea from '@/components/common/TextArea';
import { TextInput } from '@/components/common/TextInput';
import CommaInput from '@/components/common/TextInput/CommaInput';
import {
  ChangeEventBaseNumberType,
  ChangeEventBaseType,
  ChangeEventMultiBaseType,
  OptionsDropdown,
} from '@/types/event.interface';
import { CampaignInfoForm, StatusCampaignForm } from '@/types/campaign.type';
import TextEditor from '@/components/common/TextEditor';
const FormGroup = dynamic(() => import('@/components/common/FormGroup'), { ssr: false });

interface MasterDataList {
  campaignObjectiveList: OptionsDropdown[];
  targetSegmentList: OptionsDropdown[];
  spendingChannelList: OptionsDropdown[];
  statusList: OptionsDropdown[];
}

interface InformationProps {
  campaignForm: CampaignInfoForm;
  masterData: MasterDataList;
  status: StatusCampaignForm;
  onChangeInput: (onChange: ChangeEventBaseType | ChangeEventBaseNumberType | ChangeEventMultiBaseType<string>) => void;
}

const Information = ({ status, masterData, campaignForm, onChangeInput }: InformationProps) => {
  return (
    <div className="pb-5 pt-8">
      <FormGroup title="Campaign Code" isHiddenBorder>
        <TextInput disabled name="campaignCode" value={campaignForm?.campaignCode} />
      </FormGroup>
      <FormGroup title="Campaign Name" isRequired>
        <TextInput
          isRequired
          disabled={status?.campaignEnded}
          name="campaignName"
          value={campaignForm?.campaignName}
          onChange={onChangeInput}
        />
      </FormGroup>
      <FormGroup title="Campaign Description" isRequired>
        <TextEditor
          isRequired
          disabled={status?.campaignEnded}
          name="campaignDesc"
          value={campaignForm?.campaignDesc}
          onChange={onChangeInput}
        />
      </FormGroup>
      <FormGroup title="Condition Detail">
        <TextArea
          isRequired
          disabled={status?.campaignEnded}
          name="conditionDetail"
          value={campaignForm?.conditionDetail}
          onChange={(e) => onChangeInput(e)}
        />
      </FormGroup>
      <FormGroup title="Campaign Objective" isRequired>
        <Dropdown
          isRequired
          disabled={status?.campaignEnded}
          name="campaignObjective"
          options={masterData?.campaignObjectiveList}
          value={campaignForm?.campaignObjective}
          onChange={onChangeInput}
        />
      </FormGroup>
      <FormGroup title="Campaign Period" isRequired>
        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            isRequired
            disabled={status?.campaignStarting || status?.campaignEnded}
            name="campaignStartDate"
            label="Campaign Start Date"
            minDate={new Date()}
            maxDate={campaignForm?.campaignEndDate ? campaignForm?.campaignEndDate : null}
            value={campaignForm?.campaignStartDate}
            onChange={onChangeInput}
          />
          <DatePicker
            isRequired
            disabled={status?.campaignEnded}
            name="campaignEndDate"
            label="Campaign End Date"
            minDate={campaignForm?.campaignStartDate}
            currentDate={
              campaignForm?.campaignStartDate
                ? new DateObject({
                    year: +campaignForm?.campaignStartDate?.slice(0, 4),
                    month: +campaignForm?.campaignStartDate?.slice(5, 7),
                    day: 1,
                  })
                : new DateObject({
                    year: new Date().getUTCFullYear(),
                    month: new Date().getMonth(),
                    day: 1,
                  })
            }
            value={campaignForm?.campaignEndDate}
            onChange={onChangeInput}
          />
        </div>
      </FormGroup>
      <FormGroup title="Campaign Amount">
        <div className="grid grid-cols-2 gap-4">
          <CommaInput
            isRequired
            disabled={status?.campaignEnded}
            name="campaignCost"
            label="Campaign Cost"
            value={campaignForm?.campaignCost}
            onChange={onChangeInput}
          />
          <CommaInput
            disabled={status?.campaignEnded}
            name="campaignBudget"
            label="Campaign Budget"
            value={campaignForm?.campaignBudget}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
      </FormGroup>

      <FormGroup title="Other">
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            disabled={status?.campaignEnded}
            name="targetSegment"
            label="Target Segment"
            options={masterData?.targetSegmentList}
            value={campaignForm?.targetSegment}
            onChange={(e) => onChangeInput(e)}
          />
          <MultiDropdown
            disabled={status?.campaignEnded}
            name="spendingChannels"
            label="Spending Channel"
            options={masterData?.spendingChannelList}
            value={campaignForm?.spendingChannels}
            onChange={onChangeInput}
          />
          <Dropdown
            isRequired
            disabled={status?.campaignEnded}
            name="campaignStatus"
            label="Campaign Status"
            options={masterData?.statusList}
            value={campaignForm?.campaignStatus}
            onChange={onChangeInput}
          />
        </div>
      </FormGroup>
    </div>
  );
};

export default Information;
