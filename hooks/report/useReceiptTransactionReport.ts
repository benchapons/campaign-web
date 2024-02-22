import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AllOptionValue, PULLING_TIME } from '@/constants/global';
import { queryParamForGetReceiptTxnReport } from '@/dto/reports.dto';
import { AuthorizedUserType } from '@/types/auth.type';
import { ChangeEventBaseType } from '@/types/event.interface';
import { QueryParamForGetTxnReportInterface } from '@/types/report-campaign.interface';
import { ReceiptTransactionReportFormType, ReportTypeEnum } from '@/types/report.type';
import axios from 'axios';
import useReport from './useReport';

const initFilterReportForm: ReceiptTransactionReportFormType = {
  buildingCode: [],
  receiptDateStringFrom: null,
  receiptDateStringTo: null,
  receiptStatus: '',
};

const useReceiptTransactionReport = (authorizedUser: AuthorizedUserType) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterReportForm, setFilterReportForm] = useState<ReceiptTransactionReportFormType>(initFilterReportForm);
  const {
    isMasterLoading,
    buildingList,
    campaignTypeList,
    handleClickAuditLog,
    fetchMasterForReceiptTxnReport,
    receiptStatusOptionList,

    fetchReportRequest,
    deleteRequestReportId,

    setPulling,
    clearIntervalHook,
    postRequestReportByReportType,
    page,
    sizePage,
    reportListPage,
    setPage,
    handlePerPage,
    handlePage,
    firstPage,
    finalPage,
    meta,
  } = useReport<ReceiptTransactionReportFormType>(
    authorizedUser,
    ReportTypeEnum.RECEIPT_TRANSACTION_REPORT,
    PULLING_TIME,
  );

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    fetchMasterForReceiptTxnReport(cancelToken.token);
    fetchReportRequest(1, 10, cancelToken.token);
    return () => {
      cancelToken.cancel();
      setIsLoading(false);
      clearIntervalHook();
      setFilterReportForm(initFilterReportForm);
      setPulling(PULLING_TIME);
      setPage(1);
    };
  }, []);

  const schema = useMemo(() => {
    return yup.object().shape({
      buildingCode: yup.array().of(yup.string()).min(1, 'กรุณาระบุ'),
      receiptDateStringFrom: yup.string().required('กรุณาระบุ'),
      receiptDateStringTo: yup.string().required('กรุณาระบุ'),
    });
  }, [filterReportForm]);

  const methodsForm = useForm({
    defaultValues: {
      buildingCode: [],
      receiptDateStringFrom: '',
      receiptDateStringTo: '',
    },
    values: {
      buildingCode: filterReportForm?.buildingCode,
      receiptDateStringFrom: filterReportForm?.receiptDateStringFrom,
      receiptDateStringTo: filterReportForm?.receiptDateStringTo,
    },
    resolver: yupResolver(schema),
  });

  // =-=-=-=-=-=-=-=-= onChange =-=-=-=-=-=-=-=-=-=
  const onChangeInput = ({ name, value }: ChangeEventBaseType<string | boolean | string[]>) => {
    if (
      name === 'buildingCode' ||
      name === 'receiptDateStringFrom' ||
      name === 'receiptDateStringTo' ||
      name === 'receiptStatus' ||
      name === 'vlcIsCollectVizSpending' ||
      name === 'isPlatinum' ||
      name === 'isRedemption'
    ) {
      let initParams: ReceiptTransactionReportFormType = {};
      if (name === 'buildingCode')
        initParams.buildingCode =
          Array.isArray(value) && value.includes(AllOptionValue) ? [AllOptionValue] : Array.isArray(value) ? value : [];

      if (name === 'receiptDateStringFrom') initParams.receiptDateStringFrom = String(value);
      if (name === 'receiptDateStringTo') initParams.receiptDateStringTo = String(value);
      if (name === 'receiptStatus') initParams.receiptStatus = String(value);
      if (name === 'vlcIsCollectVizSpending') initParams.isVizCollect = Boolean(value);
      if (name === 'isPlatinum') initParams.isPlatinumCollect = Boolean(value);
      if (name === 'isRedemption') initParams.isRedemption = Boolean(value);
      setFilterReportForm({ ...filterReportForm, ...initParams });
    }
  };

  // =-=-=-=-=-=-=-=-= Action =-=-=-=-=-=-=-=-=-=
  const handleClickExport = async () => {
    const params: QueryParamForGetTxnReportInterface = queryParamForGetReceiptTxnReport(filterReportForm);
    postRequestReportByReportType(params);
  };

  return {
    isLoading: isMasterLoading || isLoading,
    methodsForm,
    filterReportForm,
    buildingList,
    campaignTypeList,
    receiptStatusOptionsLists: receiptStatusOptionList,
    onChangeInput,
    handleClickExport: methodsForm?.handleSubmit(handleClickExport),
    handleClickAuditLog,

    deleteRequestReportId,
    postRequestReportByReportType,
    page,
    sizePage,
    reportListPage,
    setPage,
    handlePerPage,
    handlePage,
    firstPage,
    finalPage,
    meta,
  };
};

export default useReceiptTransactionReport;
