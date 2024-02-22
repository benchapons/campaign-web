import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/common/Checkbox';
import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import FormGroup from '@/components/common/FormGroup';
import { Radio } from '@/components/common/Radio';
import { CheckboxBuildingOther, QuotaPerPerson } from '../../components';

import {
  ChangeEventBaseNumberType,
  ChangeEventBaseType,
  ChangeEventMultiBaseType,
  OptionsDropdown,
} from '@/types/event.interface';
import { CampaignTypeEnum, SpendingTypeEnum } from '@/constants/enum';
import { resolveName } from '@/utilities/format';
import TextArea from '@/components/common/TextArea';
import { StatusCampaignForm } from '@/types/campaign.type';
import MultiColorDropdown from '@/components/common/Dropdown/MultiColorDropdown';
import master from '@/pages/master';

interface MasterDataList {
  campaignTypeList: OptionsDropdown[];
  buildingList: OptionsDropdown[];
  bankList: OptionsDropdown[];
}

interface CampaignCriteriaProps {
  status: StatusCampaignForm;
  name: string;
  masterData: MasterDataList;
  condition: any;
  onChangeInput: (
    data: ChangeEventBaseType<string | boolean> | ChangeEventBaseNumberType | ChangeEventMultiBaseType,
    campaignId: string
  ) => void;
  onChangeInputBuildingOther: (campaignId: string, data: any) => void;
  onChangeQuotaInput: (data: any, conditionId: string) => void;
}

const CampaignCriteria = ({
  status,
  name,
  masterData,
  condition,
  onChangeInput,
  onChangeInputBuildingOther,
  onChangeQuotaInput,
}: CampaignCriteriaProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <FormGroup title="Condition Group Name" isRequired isHiddenBorder>
        <TextArea
          isRequired
          disabled={status?.campaignEnded}
          name={`${name}conditionGroup`}
          value={condition?.conditionGroup}
          onChange={(e) => onChangeInput(e, condition?._id)}
        />
        <Checkbox
          disabled={status?.campaignEnded}
          label="Extra (รับเพิ่ม)"
          name={`${name}isExtraCondition`}
          value={condition?.isExtraCondition}
          checked={condition?.isExtraCondition}
          onChange={(e) => onChangeInput(e, condition?._id)}
        />
      </FormGroup>
      <FormGroup title="Campaign Type" isRequired isHiddenBorder>
        <Dropdown
          disabled={status?.campaignStarting || status?.campaignEnded}
          name={`${name}campaignType`}
          options={masterData?.campaignTypeList}
          value={condition?.campaignType}
          onChange={(e) => onChangeInput(e, condition?._id)}
        />
      </FormGroup>
      {condition?.campaignType === CampaignTypeEnum?.BANK ? (
        <FormGroup title="Bank Name" isRequired isHiddenBorder>
          <MultiColorDropdown
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}bankNames`}
            options={masterData?.bankList}
            value={condition?.bankNames}
            onChange={(e) => onChangeInput(e, condition?._id)}
          />
        </FormGroup>
      ) : null}
      <FormGroup title="Building" isRequired>
        <div className="grid grid-cols-2">
          {masterData?.buildingList?.map((i) => (
            <Checkbox
              key={i?.id}
              disabled={status?.campaignStarting || status?.campaignEnded}
              name={`${name}building`}
              value={i?.value}
              label={i?.label}
              checked={condition?.building?.some((building: any) => building === i?.value)}
              onChange={(e) => onChangeInput(e, condition?._id)}
            />
          ))}
          <CheckboxBuildingOther
            name={`${name}building`}
            label="Other"
            disabled={status?.campaignStarting || status?.campaignEnded}
            campaignId={condition?._id}
            value={condition?.buildingOther}
            onChange={onChangeInputBuildingOther}
          />
        </div>
        {resolveName(`${name}building`, errors)?.message && (
          <span className="text-red text-sm">{resolveName(`${name}building`, errors)?.message}</span>
        )}
      </FormGroup>
      {condition?.campaignType === CampaignTypeEnum?.BRAND ? (
        <FormGroup title="Brand" isRequired isHiddenBorder>
          <TextArea
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}brand`}
            value={condition?.brand}
            rows={2}
            onChange={(e) => onChangeInput(e, condition?._id)}
          />
        </FormGroup>
      ) : null}

      <QuotaPerPerson
        name={`${name}customerQuota.`}
        disabledCondition={status?.campaignStarting || status?.campaignEnded}
        value={condition?.customerQuota}
        onChangeInput={(e) => onChangeQuotaInput(e, condition?._id)}
      />
      <FormGroup title="Spending">
        <div className="grid grid-cols-2 gap-4">
          <Radio
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}spendingType`}
            label="Normal Spending Amount"
            desc="(กำหนดยอดซื้อที่ใช้ร่วมกิจกรรม)"
            value={SpendingTypeEnum?.NORMAL}
            checked={condition?.spendingType === SpendingTypeEnum?.NORMAL}
            onChange={(e) => onChangeInput(e, condition?._id)}
          />
          <Radio
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}spendingType`}
            label="Tier Criteria Spending Amount"
            desc="(กำหนดยอดซื้อเป็นลำดับขั้น)"
            value={SpendingTypeEnum?.TIER}
            checked={condition?.spendingType === SpendingTypeEnum?.TIER}
            onChange={(e) => onChangeInput(e, condition?._id)}
          />
        </div>
      </FormGroup>
    </div>
  );
};

export default CampaignCriteria;
