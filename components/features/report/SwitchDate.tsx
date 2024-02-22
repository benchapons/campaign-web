import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { DatePicker } from '@/components/common/DatePicker';
import FormInput from '@/components/common/FormGroup/FormInput';

import { DateTypeReportEnum } from '@/constants/enum';
import { ChangeEventBaseType } from '@/types/event.interface';
import { BankPromotionFormType, RedemptionTransactionReceiptFormType } from '@/types/report.type';
import { DateObject } from 'react-multi-date-picker';
import { convertDateByFormat } from '@/utilities/format';

interface PropsType {
  reportForm: RedemptionTransactionReceiptFormType | BankPromotionFormType;
  onChangeInput: (event: ChangeEventBaseType<string | boolean>) => void;
}

const SwitchDate = ({ reportForm, onChangeInput }: PropsType) => {
  const [dateType, setDateType] = useState<DateTypeReportEnum | null>(null);

  const onClickPanel = (type: DateTypeReportEnum) => {
    setDateType(type);
  };

  const maxDateRedemptionFrom = useMemo(() => {
    if (reportForm?.redemptionDateTo) return reportForm?.redemptionDateTo;
    return new Date();
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const minDateRedemptionFrom = useMemo(() => {
    if (reportForm?.redemptionDateTo) {
      const newDate = dayjs(reportForm?.redemptionDateTo)
        .subtract(90, 'day')
        .format('YYYY-MM-DD');
      return new Date(newDate);
    }
    return undefined;
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const maxDateRedemptionTo = useMemo(() => {
    if (!reportForm?.redemptionDateFrom) return new Date();
    if (reportForm?.redemptionDateFrom) {
      const newDate = dayjs(reportForm?.redemptionDateFrom)
        .add(90, 'day')
        .format('YYYY-MM-DD');
      return new Date().setHours(0, 0, 0, 0) < new Date(newDate).setHours(0, 0, 0, 0) ? new Date() : new Date(newDate);
    }
    return undefined;
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const minDateRedemptionTo = useMemo(() => {
    if (!reportForm?.redemptionDateFrom) return undefined;
    if (reportForm?.redemptionDateFrom) return reportForm?.redemptionDateFrom;
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const maxDateReceiptFrom = useMemo(() => {
    if (reportForm?.receiptDateTo) return reportForm?.receiptDateTo;
    return new Date();
  }, [reportForm?.receiptDateFrom, reportForm?.receiptDateTo]);

  const minDateReceiptFrom = useMemo(() => {
    if (reportForm?.receiptDateTo) {
      const newDate = dayjs(reportForm?.receiptDateTo)
        .subtract(90, 'day')
        .format('YYYY-MM-DD');
      return new Date(newDate);
    }
    return undefined;
  }, [reportForm?.receiptDateFrom, reportForm?.receiptDateTo]);

  const maxDateReceiptTo = useMemo(() => {
    if (reportForm?.receiptDateFrom) {
      const newDate = dayjs(reportForm?.receiptDateFrom)
        .add(90, 'day')
        .format('YYYY-MM-DD');
      return new Date().setHours(0, 0, 0, 0) < new Date(newDate).setHours(0, 0, 0, 0) ? new Date() : new Date(newDate);
    }
    return new Date();
  }, [reportForm?.receiptDateFrom, reportForm?.receiptDateTo]);

  const minDateReceiptTo = useMemo(() => {
    if (!reportForm?.receiptDateFrom) return undefined;
    if (reportForm?.receiptDateFrom) return reportForm?.receiptDateFrom;
  }, [reportForm?.receiptDateFrom, reportForm?.receiptDateTo]);

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
        value={DateTypeReportEnum.REDEMPTION_DATE}
        name="dateType"
        test-id="redemption-date"
        checked={dateType === DateTypeReportEnum.REDEMPTION_DATE}
      />
      <FormInput
        isRequired={dateType === DateTypeReportEnum.REDEMPTION_DATE || !reportForm?.dateType}
        title="Redemption Date From"
        supTitle={`(เลือก Date ได้สูงสุดไม่เกิน 3 เดือน)`}
      >
        <DatePicker
          name="redemptionDateFrom"
          value={reportForm?.redemptionDateFrom}
          maxDate={maxDateRedemptionFrom}
          minDate={minDateRedemptionFrom}
          classNameInput={
            dateType === DateTypeReportEnum.RECEIPT_DATE ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim' : ''
          }
          onChange={onChangeInput}
          onOpen={() => onClickPanel(DateTypeReportEnum.REDEMPTION_DATE)}
        />
      </FormInput>
      <FormInput isRequired={dateType === DateTypeReportEnum.REDEMPTION_DATE || !reportForm?.dateType} title="To">
        <DatePicker
          name="redemptionDateTo"
          value={reportForm?.redemptionDateTo}
          maxDate={maxDateRedemptionTo}
          minDate={minDateRedemptionTo}
          currentDate={getCurrentDate(
            convertDateByFormat(reportForm?.redemptionDateFrom || dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD')
          )}
          classNameInput={
            dateType === DateTypeReportEnum.RECEIPT_DATE ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim' : ''
          }
          onChange={onChangeInput}
          onOpen={() => onClickPanel(DateTypeReportEnum.REDEMPTION_DATE)}
        />
      </FormInput>

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
        isRequired={dateType === DateTypeReportEnum.RECEIPT_DATE || !reportForm?.dateType}
        title="Receipt Date From"
        supTitle={`(เลือก Date ได้สูงสุดไม่เกิน 3 เดือน)`}
      >
        <DatePicker
          name="receiptDateFrom"
          value={reportForm?.receiptDateFrom}
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
      <FormInput isRequired={dateType === DateTypeReportEnum.RECEIPT_DATE || !reportForm?.dateType} title="To">
        <DatePicker
          name="receiptDateTo"
          value={reportForm?.receiptDateTo}
          maxDate={maxDateReceiptTo}
          minDate={minDateReceiptTo}
          currentDate={getCurrentDate(
            convertDateByFormat(reportForm?.receiptDateFrom || dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD')
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

export default SwitchDate;
