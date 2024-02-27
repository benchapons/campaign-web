import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DateTypeReportEnum } from '@/constants/enum';
import { PULLING_TIME } from '@/constants/global';
import { paramsReportBank } from '@/dto/reports.dto';
import { AuthorizedUserType } from '@/types/auth.type';
import { ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import { BankPromotionFormType, ReportTypeEnum } from '@/types/report.type';
import useReport from './useReport';

const initReportForm: BankPromotionFormType = {
  building: [],
  redemptionDateFrom: null,
  redemptionDateTo: null,
  receiptDateFrom: null,
  receiptDateTo: null,
  campaignName: '',
  conditionGroupName: '',
  dateType: null,
};

const useBankPromotion = (authorizedUser: AuthorizedUserType) => {
  const {
    isMasterLoading,
    buildingList,
    campaignNameList,
    campaignList,
    fetchMasterBankData,
    fetchCampaignName,
    handleClickAuditLog,

    fetchReportRequest,
    deleteRequestReportId,
    reSentEmail,
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
  } = useReport<BankPromotionFormType>(
    authorizedUser,
    ReportTypeEnum.BANK_PROMOTION_REPORT,
    PULLING_TIME,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportForm, setReportForm] = useState<BankPromotionFormType>(initReportForm);
  const [campaignGroupNameList, setCampaignGroupNameList] = useState<OptionsDropdown[]>([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      building: yup.array().of(yup.string()).min(1, 'กรุณาระบุ'),
      ...(reportForm?.dateType === DateTypeReportEnum?.RECEIPT_DATE && {
        receiptDateFrom: yup.string().nullable().required('กรุณาระบุ'),
        receiptDateTo: yup.string().nullable().required('กรุณาระบุ'),
      }),
      ...(reportForm?.dateType === DateTypeReportEnum?.REDEMPTION_DATE && {
        redemptionDateFrom: yup.string().nullable().required('กรุณาระบุ'),
        redemptionDateTo: yup.string().nullable().required('กรุณาระบุ'),
      }),
      ...(!reportForm?.dateType && {
        receiptDateFrom: yup.string().nullable().required('กรุณาระบุ'),
        receiptDateTo: yup.string().nullable().required('กรุณาระบุ'),
        redemptionDateFrom: yup.string().nullable().required('กรุณาระบุ'),
        redemptionDateTo: yup.string().nullable().required('กรุณาระบุ'),
      }),
    });
  }, [reportForm]);

  const methodsForm = useForm({
    defaultValues: {
      building: [],
      ...(reportForm?.dateType === DateTypeReportEnum?.RECEIPT_DATE && {
        receiptDateFrom: '',
        receiptDateTo: '',
      }),
      ...(reportForm?.dateType === DateTypeReportEnum?.REDEMPTION_DATE && {
        redemptionDateFrom: '',
        redemptionDateTo: '',
      }),
      ...(!reportForm?.dateType && {
        receiptDateFrom: '',
        receiptDateTo: '',
        redemptionDateFrom: '',
        redemptionDateTo: '',
      }),
    },
    values: {
      building: reportForm?.building,
      ...(reportForm?.dateType === DateTypeReportEnum?.RECEIPT_DATE && {
        receiptDateFrom: reportForm?.receiptDateFrom,
        receiptDateTo: reportForm?.receiptDateTo,
      }),
      ...(reportForm?.dateType === DateTypeReportEnum?.REDEMPTION_DATE && {
        redemptionDateFrom: reportForm?.redemptionDateFrom,
        redemptionDateTo: reportForm?.redemptionDateTo,
      }),
      ...(!reportForm?.dateType && {
        receiptDateFrom: reportForm?.receiptDateFrom,
        receiptDateTo: reportForm?.receiptDateTo,
        redemptionDateFrom: reportForm?.redemptionDateFrom,
        redemptionDateTo: reportForm?.redemptionDateTo,
      }),
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    fetchMasterBankData(cancelToken.token);
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
      name === 'receiptDateFrom' ||
      name === 'receiptDateTo' ||
      name === 'redemptionDateFrom' ||
      name === 'redemptionDateTo'
    ) {
      let initParams = {
        ...reportForm,
        campaignType: 'Bank',
        [name]: name === 'building' && Array.isArray(value) ? value.join(',') : value,
      };
      if (name === 'receiptDateFrom' || name === 'receiptDateTo') {
        delete initParams?.redemptionDateFrom;
        delete initParams?.redemptionDateTo;
      }
      if (name === 'redemptionDateFrom' || name === 'redemptionDateTo') {
        delete initParams?.receiptDateFrom;
        delete initParams?.receiptDateTo;
      }
      if (
        (initParams?.building && initParams?.redemptionDateFrom && initParams?.redemptionDateTo) ||
        (initParams?.building && initParams?.receiptDateFrom && initParams?.receiptDateTo)
      ) {
        fetchCampaignName(initParams);
      }
    }
    if (name === 'receiptDateFrom' || name === 'receiptDateTo') {
      setReportForm({
        ...reportForm,
        redemptionDateFrom: null,
        redemptionDateTo: null,
        [name]: value,
        dateType: DateTypeReportEnum?.RECEIPT_DATE,
      });
      return;
    }
    if (name === 'redemptionDateFrom' || name === 'redemptionDateTo') {
      setReportForm({
        ...reportForm,
        receiptDateFrom: null,
        receiptDateTo: null,
        [name]: value,
        dateType: DateTypeReportEnum?.REDEMPTION_DATE,
      });
      return;
    }
    if (name === 'campaignName') {
      const condition = campaignList?.find((i) => i?.campaignName === value);
      const groupNameList = condition?.condition
        ? condition?.condition?.map((i: any) => ({ label: i?.conditionGroupName, value: i?.conditionGroupName }))
        : [];
      setCampaignGroupNameList(groupNameList);
    }
    setReportForm({ ...reportForm, [name]: value });
  };

  // =-=-=-=-=-=-=-=-= Action =-=-=-=-=-=-=-=-=-=

  const handleClickExport = async () => {
    const params = paramsReportBank(reportForm, campaignList);
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

export default useBankPromotion;
