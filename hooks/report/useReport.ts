import { CancelToken } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { SwalCustom } from '@/configurations/alert';
import { ConstantStatusFromCampaign } from '@/constants/enum';
import { transformCampaignName } from '@/dto/reports.dto';
import { getMasterConstant, getMasterData, getMasterDataCS } from '@/services/client/master.service';
import {
  deleteReportByRequestId,
  getCampaignName,
  getReportByParam,
  postRequestReport,
} from '@/services/client/report.service';
import { CampaignMasterState, campaignMasterState } from '@/store/master-campaign';
import { AuthorizedUserType } from '@/types/auth.type';
import { ListReport, Meta, ReportTypeEnum, StatusReportEnum } from '@/types/report.type';
import useInterval from '../interval/useInterval.hook';
import usePaginationReport from './usePaginationReport.hook';

const useReport = <V>(
  authorizedUser: AuthorizedUserType,
  reportType: ReportTypeEnum,
  pullingTime: number,
) => {
  const [pulling, setPulling] = useState(pullingTime);
  const [reportList, setReportList] = useState<ListReport<V>[]>([]);
  const [meta, setMeta] = useState<Meta>({
    currentPage: 1,
    limit: 10,
    totalPage: 0,
    totalData: 0,
  });

  const router = useRouter();
  const [masterDataStore, setMasterDataStore] = useRecoilState(campaignMasterState);

  const [isMasterLoading, setIsMasterLoading] = useState<boolean>(false);
  const [campaignList, setCampaignList] = useState<any[]>([]);

  const { clearIntervalHook, startTime } = useInterval(() => {
    if (pulling > 0) return setPulling((time) => time - 1);
    fetchReportRequest(page, sizePage);
  }, 1000);

  const checkMasterData = (master: any[], channel: string, cancelToken: CancelToken) => {
    if (master?.length) return Promise.resolve();
    return getMasterData(channel, cancelToken);
  };

  const fetchMasterForReceiptTxnReport = async (cancelToken: CancelToken) => {
    const getBuildingType = checkMasterData(masterDataStore?.buildingList, 'CAMPAIGN_BUILDING', cancelToken);
    const getReceiptStatus = getMasterConstant(ConstantStatusFromCampaign.RECEIPT_STATUS, cancelToken);

    Promise.all([getBuildingType, getReceiptStatus])
      .then(([_building, _receiptStatus]) => {
        setMasterDataStore((prev: CampaignMasterState) => ({
          ...prev,
          ...(_building && { buildingList: _building }),
          ...(_receiptStatus && { receiptStatus: _receiptStatus }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  const fetchMasterConditionData = (cancelToken: CancelToken) => {
    const getStatusType = checkMasterData(masterDataStore?.statusList, 'REDEMPTION_STATUS', cancelToken);
    const getCampaignType = checkMasterData(masterDataStore?.campaignTypeList, 'CAMPAIGN_TYPE', cancelToken);
    const getBuildingType = checkMasterData(masterDataStore?.buildingList, 'CAMPAIGN_BUILDING', cancelToken);
    const getRewardType = checkMasterData(masterDataStore?.rewardTypeList, 'REWARD_TYPE', cancelToken);

    Promise.all([getBuildingType, getCampaignType, getStatusType, getRewardType])
      .then(([_building, _type, _status, _rewardType]) => {
        setMasterDataStore((prev: CampaignMasterState) => ({
          ...prev,
          ...(_type && { campaignTypeList: _type }),
          ...(_building && { buildingList: _building }),
          ...(_status && { redemptionStatusList: _status }),
          ...(_rewardType && { rewardTypeList: _rewardType }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  const fetchMasterReceiptData = (cancelToken: CancelToken) => {
    const getStatusType = checkMasterData(masterDataStore?.statusList, 'REDEMPTION_STATUS', cancelToken);
    const getCampaignType = checkMasterData(masterDataStore?.campaignTypeList, 'CAMPAIGN_TYPE', cancelToken);
    const getBuildingType = checkMasterData(masterDataStore?.buildingList, 'CAMPAIGN_BUILDING', cancelToken);
    const getReceiptBuilding = getMasterDataCS('Building', cancelToken);
    Promise.all([getBuildingType, getCampaignType, getStatusType, getReceiptBuilding])
      .then(([_building, _type, _status, _receiptBuilding]) => {
        setMasterDataStore((prev: CampaignMasterState) => ({
          ...prev,
          ...(_type && { campaignTypeList: _type }),
          ...(_building && { buildingList: _building }),
          ...(_status && { redemptionStatusList: _status }),
          ...(_receiptBuilding && { receiptBuildingList: _receiptBuilding }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  const fetchMasterSummaryData = (cancelToken: CancelToken) => {
    const getBuildingType = checkMasterData(masterDataStore?.buildingList, 'CAMPAIGN_BUILDING', cancelToken);
    const getRewardType = checkMasterData(masterDataStore?.rewardTypeList, 'REWARD_TYPE', cancelToken);
    Promise.all([getBuildingType, getRewardType])
      .then(([_building, _rewardType]) => {
        setMasterDataStore((prev: CampaignMasterState) => ({
          ...prev,
          ...(_building && { buildingList: _building }),
          ...(_rewardType && { rewardTypeList: _rewardType }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  const fetchMasterBankData = (cancelToken: CancelToken) => {
    const getBuildingType = checkMasterData(masterDataStore?.buildingList, 'CAMPAIGN_BUILDING', cancelToken);
    Promise.all([getBuildingType])
      .then(([_building]) => {
        setMasterDataStore((prev: CampaignMasterState) => ({
          ...prev,
          ...(_building && { buildingList: _building }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  const fetchCampaignName = async (param: any) => {
    try {
      const res = await getCampaignName(param);
      const campaignList = res?.data?.map((item: any) => {
        return { ...item, campaignName: `${item?.campaignCode} : ${item?.campaignName}` };
      });
      setCampaignList(campaignList);
    } catch (error: any) { }
  };

  const handleClickAuditLog = (ownerId: string, page: string) => {
    router.push(`/auditlogs/${ownerId}?page=${page}`);
  };

  const deleteRequestReportId = async (requestId: string) => {
    deleteReportByRequestId(requestId)
      .then(() => {
        fetchReportRequest(1, sizePage);
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      });
  };

  const fetchReportRequest = (page: number, sizePage: number, cancelToken?: CancelToken) => {
    getReportByParam<V>(
      {
        page: page,
        limit: sizePage,
        reportType: reportType,
        requestByUserId: authorizedUser.id,
      },
      cancelToken
    )
      .then((res) => {
        setMeta(res.meta);
        setReportList(res.results);
        const isJobPending = res.results.findIndex((data) => data.status === StatusReportEnum.PENDING) > -1;

        if (!isJobPending) return clearIntervalHook();

        setPulling(pullingTime);
        startTime();
      })
      .catch((error) => {
        clearIntervalHook();
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      });
  };

  const postRequestReportByReportType = <T>(params: T) => {
    postRequestReport(
      {
        ...params,
        requestByUserId: authorizedUser.id,
        requestByUserName: authorizedUser.displayName,
      },
      reportType
    )
      .then(() => {
        fetchReportRequest(1, sizePage);
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      });
  };

  const { page, sizePage, reportListPage, setPage, handlePerPage, handlePage, firstPage, finalPage } =
    usePaginationReport<ListReport<V>>(reportList, 10, fetchReportRequest, meta.totalData);

  return {
    isMasterLoading,
    buildingList: masterDataStore?.buildingList,
    campaignTypeList: masterDataStore?.campaignTypeList,
    statusList: masterDataStore?.redemptionStatusList,
    rewardTypeList: masterDataStore?.rewardTypeList,
    receiptBuildingList: masterDataStore?.receiptBuildingList,
    receiptStatusOptionList: masterDataStore?.receiptStatus,
    campaignList,
    campaignNameList: transformCampaignName(campaignList),
    fetchMasterConditionData,
    fetchMasterReceiptData,
    fetchMasterSummaryData,
    fetchMasterBankData,
    fetchCampaignName,
    handleClickAuditLog,
    fetchMasterForReceiptTxnReport,
    fetchReportRequest,
    deleteRequestReportId,
    postRequestReportByReportType,
    pulling,
    setPulling,
    clearIntervalHook,
    startTime,
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

export default useReport;
