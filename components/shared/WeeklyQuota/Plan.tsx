import { useFormContext } from 'react-hook-form';
import { MdAdd, MdOutlineDeleteForever } from 'react-icons/md';

import { Checkbox } from '@/components/common/Checkbox';
import { CommaInput } from '@/components/common/TextInput';

import { maxOrder, minOrder } from '@/utilities/weekly';
import { resolveName } from '@/utilities/format';
import { SwalCustom } from '@/configurations/alert';
import { DaysFormType } from '@/types/reward.type';
import { nameValidate } from '@/utilities/resolver';

interface PlanProps {
  isDelete: boolean;
  value: any;
  label: string;
  index: number;
  disabledCondition?: boolean;
  disabledAmount?: boolean;
  total: DaysFormType[];
  name: string;
  onChange: (data: any) => void;
  handleAddPlan: () => void;
  handleDeletePlan: (weekDayId: string) => void;
}

const Plan = ({
  isDelete,
  disabledCondition,
  disabledAmount,
  index,
  value,
  label,
  total,
  name,
  onChange,
  handleAddPlan,
  handleDeletePlan,
}: PlanProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const handleOnChange = (event: any) => {
    const realName = nameValidate(event?.name);
    const changeEvent = {
      ...value,
      [realName]: event?.value,
    };
    onChange?.(changeEvent);
  };

  const logicWeekly = (dataDays: any, isChecked: boolean, currentDays: number, minDays: number, maxDays: number) => {
    if (isChecked) {
      // check cross days
      const betweenDisable = dataDays
        ?.filter((i: any) => i?.order >= minDays && i?.order <= maxDays)
        .some((m: any) => m?.disabled);
      if (!betweenDisable)
        return dataDays?.map((i: any) => (i?.order >= minDays && i?.order <= maxDays ? { ...i, isChecked: true } : i));
      SwalCustom.fire(`ขออภัย`, 'ปัจุบันยังไม่รองรับการเลือกข้ามวัน', 'error');
      return;
    } else {
      if (currentDays + 1 === minDays) {
        return dataDays;
      }

      return dataDays?.map((i: any) =>
        i?.order >= minDays && i?.order < currentDays ? { ...i, isChecked: true } : { ...i, isChecked: false }
      );
    }
  };

  const handleOnChangDay = (event: any, nameDay: string) => {
    const currentDays = value?.days?.find((i: any) => i?.name === nameDay)?.order;
    //normal
    let days;
    const normalAfterDays = value?.days?.filter((i: any) => i?.isChecked && !i?.disabled);
    const normalDays = value?.days?.map((i: any) => (i?.name === nameDay ? { ...i, isChecked: event?.value } : i));
    const checkedDays = normalDays?.filter((i: any) => i?.isChecked && !i?.disabled);
    if (!checkedDays?.length || !normalAfterDays?.length) days = normalDays;
    else {
      const minDays = minOrder(checkedDays);
      const maxDays = maxOrder(checkedDays);
      days = logicWeekly(normalDays, event?.value, currentDays, minDays, maxDays);
    }

    const changeEvent = {
      ...value,
      days: days || value?.days,
      // days: normalDays,
      lastChecked: {
        name: nameDay,
        isChecked: event?.value,
      },
    };
    onChange?.(changeEvent);
  };

  return (
    <div className="w-full border border-gray-gainsboro p-2 rounded-md flex justify-between">
      <div className="flex flex-col">
        <div className="flex items-center ">
          <Checkbox
            label={label}
            name={name ? `${name}.weekdays.${index}.isChecked` : `weekdays.${index}.isChecked`}
            disabled={disabledCondition}
            checked={value?.isChecked}
            onChange={handleOnChange}
          />
          <CommaInput
            name={name ? `${name}.weekdays.${index}.amount` : `weekdays.${index}.amount`}
            decimal={0}
            disabled={disabledAmount}
            value={value?.amount}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex ml-7 gap-1">
          {value?.days?.map((day: DaysFormType, idx: number) => (
            <Checkbox
              key={day?.name}
              label={day?.label}
              name={name ? `${name}.weekdays.${index}.days` : `weekdays.${index}.days`}
              value={day?.name}
              disabled={disabledCondition || day?.disabled}
              checked={day?.isChecked}
              onChange={(e) => handleOnChangDay(e, day?.name)}
            />
          ))}
        </div>
        {resolveName(name ? `${name}.weekdays.${index}.days` : `weekdays.${index}.days`, errors)?.message && (
          <span className="text-red text-sm">
            {resolveName(name ? `${name}.weekdays.${index}.days` : `weekdays.${index}.days`, errors)?.message}
          </span>
        )}
      </div>
      <div>
        {!disabledCondition ? (
          isDelete ? (
            <button
              test-id="delete-weekly"
              className="min-w-[30px] min-h-[30px] border border-gray-gainsboro rounded-md flex justify-center items-center hover:border-red"
              onClick={() => handleDeletePlan(value?._id)}
            >
              <MdOutlineDeleteForever className="text-xl text-red" />
            </button>
          ) : (
            <button
              test-id="add-weekly"
              className="min-w-[30px] min-h-[30px] border border-gray-gainsboro rounded-md flex justify-center items-center hover:border-blue-pacific"
              onClick={handleAddPlan}
            >
              <MdAdd className="text-xl text-blue-pacific" />
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};
export default Plan;
