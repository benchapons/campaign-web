import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AllOptionValue, PULLING_TIME } from '@/constants/global';
import { paramsReportSummary } from '@/dto/reports.dto';
import { AuthorizedUserType } from '@/types/auth.type';
import { ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import { ReportTypeEnum, SummaryRedemptionRewardFormType } from '@/types/report.type';
import useReport from './useReport';

const initReportForm: SummaryRedemptionRewardFormType = {
  building: [],
  campaignDateFrom: null,
  campaignDateTo: null,
  campaignName: '',
  conditionGroupName: '',
  rewardType: '',
  rewardName: '',
};

const useSummaryRedemptionReward = (authorizedUser: AuthorizedUserType) => {
  const {
    isMasterLoading,
    buildingList,
    campaignNameList,
    campaignList,
    rewardTypeList,
    fetchMasterSummaryData,
    fetchCampaignName,
    handleClickAuditLog,
    reSentEmail,
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
  } = useReport<SummaryRedemptionRewardFormType>(
    authorizedUser,
    ReportTypeEnum.SUMMARY_REDEMPTION_REWARD_REPORT,
    PULLING_TIME,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportForm, setReportForm] = useState<SummaryRedemptionRewardFormType>(initReportForm);
  const [campaignGroupNameList, setCampaignGroupNameList] = useState<OptionsDropdown[]>([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      building: yup.array().of(yup.string()).min(1, 'กรุณาระบุ'),
      campaignDateFrom: yup.string().nullable().required('กรุณาระบุ'),
      campaignDateTo: yup.string().nullable().required('กรุณาระบุ'),
    });
  }, []);

  const methodsForm = useForm({
    defaultValues: {
      building: [],
      campaignDateFrom: '',
      campaignDateTo: '',
    },
    values: {
      building: reportForm?.building,
      campaignDateFrom: reportForm?.campaignDateFrom,
      campaignDateTo: reportForm?.campaignDateTo,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    fetchMasterSummaryData(cancelToken.token);
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
    if (name === 'building' || name === 'campaignDateFrom' || name === 'campaignDateTo') {
      let initParams = {
        ...reportForm,
        [name]: name === 'building' && Array.isArray(value) ? value.join(',') : value,
      };
      if (initParams?.building && initParams?.campaignDateFrom && initParams?.campaignDateTo) {
        fetchCampaignName(initParams);
      }
    }

    if (name === 'building' && Array.isArray(value) && value.includes(AllOptionValue))
      setReportForm({ ...reportForm, [name]: [AllOptionValue] });
    else setReportForm({ ...reportForm, [name]: value });


    if (name === 'campaignName') {
      const condition = campaignList?.find((i) => i?.campaignName === value);
      const groupNameList = condition?.condition
        ? condition?.condition?.map((i: any) => ({ label: i?.conditionGroupName, value: i?.conditionGroupName }))
        : [];

      setCampaignGroupNameList(groupNameList);
    }
  };

  // =-=-=-=-=-=-=-=-= Action =-=-=-=-=-=-=-=-=-=

  const handleClickExport = async () => {

    const params = paramsReportSummary(reportForm, campaignList);
    postRequestReportByReportType(params);
  };

  return {
    isLoading: isLoading || isMasterLoading,
    methodsForm,
    reportForm,
    buildingList,
    campaignNameList,
    campaignGroupNameList,
    onChangeInput,
    handleClickExport: methodsForm?.handleSubmit(handleClickExport),
    handleClickAuditLog,
    reSentEmail,
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

export default useSummaryRedemptionReward;
