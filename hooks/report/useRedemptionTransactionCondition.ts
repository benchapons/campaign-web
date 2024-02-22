import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AllOptionValue, PULLING_TIME } from '@/constants/global';
import { paramsReportCondition } from '@/dto/reports.dto';
import { AuthorizedUserType } from '@/types/auth.type';
import { ChangeEventBaseType } from '@/types/event.interface';
import { RedemptionTransactionConditionFormType, ReportTypeEnum } from '@/types/report.type';
import useReport from './useReport';

const initReportForm: RedemptionTransactionConditionFormType = {
  building: [],
  campaignType: '',
  redemptionDateFrom: null,
  redemptionDateTo: null,
  campaignName: '',
  redemptionStatus: '',
};

const useRedemptionTransactionCondition = (authorizedUser: AuthorizedUserType) => {
  const {
    isMasterLoading,
    buildingList,
    campaignTypeList,
    statusList,
    campaignNameList,
    campaignList,
    rewardTypeList,
    fetchMasterConditionData,
    fetchCampaignName,
    handleClickAuditLog,

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
  } = useReport<RedemptionTransactionConditionFormType>(authorizedUser,
    ReportTypeEnum.REDEMPTION_TRANSACTION_CONDITION_REPORT,
    PULLING_TIME,);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportForm, setReportForm] = useState<RedemptionTransactionConditionFormType>(initReportForm);

  const schema = useMemo(() => {
    return yup.object().shape({
      building: yup.array().of(yup.string()).min(1, 'กรุณาระบุ'),
      redemptionDateFrom: yup.string().nullable().required('กรุณาระบุ'),
      redemptionDateTo: yup.string().nullable().required('กรุณาระบุ'),
    });
  }, []);

  const methodsForm = useForm({
    defaultValues: {
      building: [],
      redemptionDateFrom: '',
      redemptionDateTo: '',
    },
    values: {
      building: reportForm?.building,
      redemptionDateFrom: reportForm?.redemptionDateFrom,
      redemptionDateTo: reportForm?.redemptionDateTo,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    fetchMasterConditionData(cancelToken.token);
    fetchReportRequest(1, 10, cancelToken.token);

    return () => {
      cancelToken.cancel();
      setIsLoading(false);
      clearIntervalHook();
      setReportForm(initReportForm);
      setPulling(PULLING_TIME);
      setPage(1);

    };
  }, []);

  // =-=-=-=-=-=-=-=-= onChange =-=-=-=-=-=-=-=-=-=

  const onChangeInput = ({ name, value }: ChangeEventBaseType<string | boolean | string[]>) => {
    if (
      name === 'building' ||
      name === 'redemptionDateFrom' ||
      name === 'redemptionDateTo' ||
      name === 'campaignType'
    ) {
      const initParams = {
        ...reportForm,
        [name]: name === 'building' && Array.isArray(value) ? value.join(',') : value,
      }
      if (initParams?.building && initParams?.redemptionDateFrom && initParams?.redemptionDateTo) {
        fetchCampaignName(initParams);
      }
    }

    if (name === 'building' && Array.isArray(value) && value.includes(AllOptionValue))
      setReportForm({ ...reportForm, [name]: [AllOptionValue] });
    else setReportForm({ ...reportForm, [name]: value });
  };

  // =-=-=-=-=-=-=-=-= Action =-=-=-=-=-=-=-=-=-=

  const handleClickExport = async () => {

    const params = paramsReportCondition(reportForm, campaignList);
    postRequestReportByReportType(params);
  };

  return {
    isLoading: isLoading || isMasterLoading,
    methodsForm,
    reportForm,
    buildingList,
    campaignTypeList,
    statusList,
    campaignNameList,
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

export default useRedemptionTransactionCondition;
