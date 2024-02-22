import { Dropdown } from '@/components/common/Dropdown';
import FormGroup from '@/components/common/FormGroup';
import { Radio } from '@/components/common/Radio';
import TextArea from '@/components/common/TextArea';
import { CommaInput, TextInput } from '@/components/common/TextInput';
import UploadFileImage from '@/components/common/UploadFileImage';

import { MasterStatusTypeEnum } from '@/constants/enum';
import { ChangeEventBaseType, ChangeEventFileType, OptionsDropdown } from '@/types/event.interface';
import { MasterFormType } from '@/types/master-management.type';

interface RewardFormProps {
  isEdit?: boolean;
  masterForm: MasterFormType;
  masterData: MasterDataList;
  onChangeInput: (data: ChangeEventBaseType<string | number | boolean>) => void;
  onChangeFile: (data: ChangeEventFileType) => void;
  onDeleteFile: () => void;
  onDeleteExistedFile: () => void;
}

interface MasterDataList {
  groupList: OptionsDropdown[];
  parentList: OptionsDropdown[];
}

const MasterForm = ({
  isEdit,
  masterForm,
  masterData,
  onChangeInput,
  onChangeFile,
  onDeleteFile,
  onDeleteExistedFile,
}: RewardFormProps) => {
  return (
    <div>
      <FormGroup title="Group Master" isRequired={!isEdit} isHiddenBorder>
        <Dropdown
          isRequired={!isEdit}
          disabled={isEdit}
          name="group"
          options={masterData?.groupList}
          value={masterForm?.group}
          onChange={onChangeInput}
        />
      </FormGroup>
      <FormGroup title="Master ID">
        <TextInput placeholder="XXXX" disabled name="masterId" value={masterForm?.masterId} onChange={onChangeInput} />
      </FormGroup>
      <FormGroup isRequired={!isEdit} title="Value">
        <TextInput disabled={isEdit} name="value" value={masterForm?.value} onChange={onChangeInput} />
      </FormGroup>
      <FormGroup title="Detail">
        <div className="grid grid-cols-2 gap-4">
          <TextInput isRequired name="nameTH" label="Label Thai" value={masterForm?.nameTH} onChange={onChangeInput} />
          <TextInput
            isRequired
            name="nameEN"
            label="Label English"
            value={masterForm?.nameEN}
            onChange={onChangeInput}
          />
        </div>
        <TextArea name="description" label="Description" value={masterForm?.description} onChange={onChangeInput} />
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            name="groupParent"
            label="Group Master Parent"
            options={masterData?.groupList}
            value={masterForm?.groupParent}
            onChange={onChangeInput}
          />
          <Dropdown
            name="parent"
            label="Parent Id"
            options={masterData?.parentList}
            value={masterForm?.parent}
            onChange={onChangeInput}
          />
          <CommaInput name="orderIndex" label="Order Index" value={masterForm?.orderIndex} onChange={onChangeInput} />
        </div>
      </FormGroup>
      <FormGroup isRequired title="Status">
        <div className="grid grid-cols-2 gap-4">
          <Radio
            name="status"
            label="Active"
            value={MasterStatusTypeEnum?.ACTIVE}
            checked={masterForm?.status === MasterStatusTypeEnum?.ACTIVE}
            onChange={onChangeInput}
          />
          <Radio
            name="status"
            label="InActive"
            value={MasterStatusTypeEnum?.INACTIVE}
            checked={masterForm?.status === MasterStatusTypeEnum?.INACTIVE}
            onChange={onChangeInput}
          />
        </div>
      </FormGroup>
      <FormGroup title="Attachment">
        <UploadFileImage
          existedFile={masterForm?.existedFile}
          name="attachment"
          onChange={onChangeFile}
          onDeleteExistedFile={onDeleteExistedFile}
          onDeleteUploadFile={onDeleteFile}
        />
      </FormGroup>
    </div>
  );
};

export default MasterForm;
