import { useMemo, useState } from 'react';

import { DatePicker } from '@/components/common/DatePicker';
import FormInput from '@/components/common/FormGroup/FormInput';

import { DateTypeReportEnum } from '@/constants/enum';
import { ChangeEventBaseType } from '@/types/event.interface';
import dayjs from 'dayjs';
import { DateObject } from 'react-multi-date-picker';
import { convertDateByFormat } from '@/utilities/format';

interface PropsType {
  receiptDateStringFrom?: string | null;
  receiptDateStringTo?: string | null;
  isRequireStartAt: boolean;
  isRequireEndAt: boolean;
  onChangeInput: (event: ChangeEventBaseType<string | boolean>) => void;
}

const ReceiptDateSelect = ({
  receiptDateStringFrom,
  receiptDateStringTo,
  onChangeInput,
  isRequireStartAt,
  isRequireEndAt,
}: PropsType) => {
  const [dateType, setDateType] = useState<DateTypeReportEnum | null>(null);

  const onClickPanel = (type: DateTypeReportEnum) => {
    setDateType(type);
  };

  const getDateTimeNext = (dateTime: string): Date => {
    const toDayDateTime = new Date();
    const targetDataTime = new Date(dateTime);
    const maxDate = new Date(dateTime);
    maxDate.setDate(targetDataTime.getDate() + 30);
    return maxDate > toDayDateTime ? toDayDateTime : maxDate;
  };

  const maxDateReceiptFrom = useMemo(() => {
    if (receiptDateStringTo) return receiptDateStringTo;
    return new Date();
  }, [receiptDateStringFrom, receiptDateStringTo]);

  const minDateReceiptFrom = useMemo(() => {
    if (receiptDateStringTo) {
      const newDate = dayjs(receiptDateStringTo).subtract(90, 'day').format('YYYY-MM-DD');
      return new Date(newDate);
    }
    return undefined;
  }, [receiptDateStringFrom, receiptDateStringTo]);

  const maxDateReceiptTo = useMemo(() => {
    if (receiptDateStringFrom) {
      const newDate = dayjs(receiptDateStringFrom).add(90, 'day').format('YYYY-MM-DD');
      return new Date().setHours(0, 0, 0, 0) < new Date(newDate).setHours(0, 0, 0, 0) ? new Date() : new Date(newDate);
    }
    return new Date();
  }, [receiptDateStringFrom, receiptDateStringTo]);

  const minDateReceiptTo = useMemo(() => {
    if (!receiptDateStringFrom) return undefined;
    if (receiptDateStringFrom) return receiptDateStringFrom;
  }, [receiptDateStringFrom, receiptDateStringTo]);

  const getCurrentDate = (dateStringFrom: string): DateObject | undefined => {
    if (dateStringFrom) return new DateObject(dayjs(dateStringFrom).format('YYYY-MM-DD'));
    return undefined;
  };

  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      <input
        className="hidden"
        type="radio"
        id="TansDate"
        value={DateTypeReportEnum.RECEIPT_DATE}
        name="dateType"
        test-id="receipt-date"
        checked={dateType === DateTypeReportEnum.RECEIPT_DATE}
      />
      <FormInput
        isRequired={isRequireStartAt}
        title="Receipt Date From"
        supTitle={`(เลือก Date ได้สูงสุดไม่เกิน 3 เดือน)`}
      >
        <DatePicker
          name="receiptDateStringFrom"
          value={receiptDateStringFrom}
          maxDate={maxDateReceiptFrom}
          minDate={minDateReceiptFrom}
          classNameInput={
            dateType === DateTypeReportEnum.REDEMPTION_DATE
              ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim'
              : ''
          }
          onChange={onChangeInput}
          onOpen={() => onClickPanel(DateTypeReportEnum.RECEIPT_DATE)}
        />
      </FormInput>
      <FormInput isRequired={isRequireEndAt} title="To">
        <DatePicker
          name="receiptDateStringTo"
          value={receiptDateStringTo}
          maxDate={maxDateReceiptTo}
          minDate={minDateReceiptTo}
          currentDate={getCurrentDate(
            convertDateByFormat(receiptDateStringFrom || dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD')
          )}
          classNameInput={
            dateType === DateTypeReportEnum.REDEMPTION_DATE
              ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim'
              : ''
          }
          onChange={onChangeInput}
          onOpen={() => onClickPanel(DateTypeReportEnum.RECEIPT_DATE)}
        />
      </FormInput>
    </div>
  );
};

export default ReceiptDateSelect;
