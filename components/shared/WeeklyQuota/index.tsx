import { WeeklyTypeEnum } from '@/constants/enum';
import { initWeekDay } from '@/store/reward';
import { maxOrder, minOrder } from '@/utilities/weekly';
import { Checkbox } from '../../common/Checkbox';
import { Radio, RadioWithCommaTextInput } from '../../common/Radio';
import Plan from './Plan';

interface WeeklyQuotaProps {
  name: string;
  value: any;
  disabledCondition?: boolean;
  disabledAmount?: boolean;
  onChange: (data: any) => void;
  handleAddPlan: () => void;
  handleDeletePlan: (weekDayId: string) => void;
}

const WeeklyQuota = ({
  name,
  disabledCondition,
  disabledAmount,
  value,
  onChange,
  handleAddPlan,
  handleDeletePlan,
}: WeeklyQuotaProps) => {
  const handleOnChangeWeekly = (event: any) => {
    const changeEvent = {
      ...value,
      ...(event?.value
        ? { weekType: WeeklyTypeEnum?.CAMPAIGN_STARTING }
        : { weekType: null, startAmount: null, weekDays: [] }),
      [event?.name]: event?.value,
    };
    onChange?.(changeEvent);
  };

  const handleOnChangeWeekDays = (data: any, weekDayId: string) => {
    const { lastChecked, ...dataWeek } = data;
    const checked = dataWeek?.days?.reduce((acc: any, cur: any) => {
      acc = Object.assign(acc, {
        [cur?.name]: cur?.isChecked,
      });
      return acc;
    }, {});

    const weekDays = value?.weekDays?.map((item: any) => {
      if (item?._id === weekDayId) {
        return dataWeek;
      }
      return item;
    });

    let newChecked: any = {};

    weekDays.forEach((week: any) => {
      newChecked = week?.days?.reduce((acc: any, cur: any) => {
        if (newChecked[cur?.name]) {
          acc = Object.assign(acc, {
            [cur?.name]: newChecked[cur?.name],
          });
        }
        acc = Object.assign(acc, {
          [cur?.name]: acc?.[cur?.name] || cur?.isChecked || checked?.[cur?.name],
        });
        return acc;
      }, {});
    });

    const newWeekday = weekDays?.map((i: any) => ({
      ...i,
      days: i?.days?.map((m: any) => ({ ...m, disabled: m?.isChecked ? false : newChecked[m?.name] })),
    }));

    const changeEvent = {
      ...value,
      weekDays: newWeekday,
      checked: newChecked,
    };
    onChange?.(changeEvent);
  };

  const handleOnChangeWeekType = (event: any) => {
    const changeEvent = {
      ...value,
      ...(event?.name === 'weekType' &&
        event?.value === WeeklyTypeEnum?.CAMPAIGN_STARTING && {
          weekType: WeeklyTypeEnum?.CAMPAIGN_STARTING,
          startAmount: '',
          weekDays: [],
        }),
      ...(event?.name === 'weekType' &&
        event?.value === WeeklyTypeEnum?.WEEKDAY && {
          weekType: WeeklyTypeEnum?.WEEKDAY,
          startAmount: '',
          weekDays: [initWeekDay],
        }),
      [event?.name]: event?.value,
    };
    onChange?.(changeEvent);
  };
  return (
    <div>
      <Checkbox
        label="จำนวนสิทธิ์ ต่ออาทิตย์"
        name="isChecked"
        disabled={disabledCondition}
        checked={value?.isChecked}
        onChange={handleOnChangeWeekly}
      />
      {value?.isChecked ? (
        <div className="flex flex-col ml-8">
          <RadioWithCommaTextInput
            nameRadio="weekType"
            nameInput={name ? `${name}.startAmount` : 'startAmount'}
            label="นับจากวันที่เริ่มต้นแคมเปญ 7 วัน"
            disabledCondition={disabledCondition}
            disabledAmount={disabledAmount}
            valueRadio={WeeklyTypeEnum?.CAMPAIGN_STARTING}
            valueInput={value?.startAmount}
            checked={value?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING}
            onChange={handleOnChangeWeekType}
          />
          <Radio
            name="weekType"
            label="แบ่งเป็น Weekday/Weekend"
            disabled={disabledCondition}
            value={WeeklyTypeEnum?.WEEKDAY}
            checked={value?.weekType === WeeklyTypeEnum?.WEEKDAY}
            onChange={handleOnChangeWeekType}
          />
          {value?.weekType === WeeklyTypeEnum?.WEEKDAY ? (
            <div className="ml-5 flex flex-col gap-4">
              {value?.weekDays?.map((item: any, idx: number) => (
                <Plan
                  key={item?._id}
                  isDelete={idx > 0}
                  value={item}
                  total={value?.checked}
                  label={`รูปแบบที่ ${idx + 1}`}
                  index={idx}
                  name={name || ''}
                  disabledCondition={disabledCondition}
                  disabledAmount={disabledAmount}
                  onChange={(e) => handleOnChangeWeekDays(e, item?._id)}
                  handleAddPlan={handleAddPlan}
                  handleDeletePlan={handleDeletePlan}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default WeeklyQuota;
