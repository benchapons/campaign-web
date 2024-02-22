import axios, { CancelToken } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

import { SwalCustom } from '@/configurations/alert';
import { getMasterData } from '@/services/client/master.service';
import { RewardMasterStateType, rewardMasterState } from '@/store/master-reward';
import { ChangeEventBaseNumberType, ChangeEventBaseType } from '@/types/event.interface';
import { AdjustmentRewardFormType } from '@/types/reward.type';

interface PropsType {
  onSubmitAdjust: (data: AdjustmentRewardFormType) => Promise<boolean>;
}

const initAdjustmentRewardForm: AdjustmentRewardFormType = {
  rewardAdjustmentType: '',
  quantity: null,
  remark: '',
};

const useAdjustmentReward = ({ onSubmitAdjust }: PropsType) => {
  const [masterDataStore, setMasterDataStore] = useRecoilState<RewardMasterStateType>(rewardMasterState);

  const [isMasterLoading, setIsMasterLoading] = useState(true);
  const [adjustmentRewardForm, setAdjustmentRewardForm] = useState<AdjustmentRewardFormType>(initAdjustmentRewardForm);

  const schema = useMemo(() => {
    return yup.object().shape({
      rewardAdjustmentType: yup.string().required('กรุณาระบุ'),
      quantity: yup.number().typeError('กรุณาระบุ').positive().min(1, 'กรุณาระบุ').required('กรุณาระบุ'),
    });
  }, []);

  const methodsForm = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    if (!masterDataStore?.rewardAdjustmentTypeList?.length) {
      fetchData(cancelToken.token);
    } else {
      setIsMasterLoading(false);
    }
    return () => {
      cancelToken.cancel();
      setIsMasterLoading(true);
    };
  }, []);

  const checkMasterData = (master: any[], channel: string, cancelToken: CancelToken) => {
    if (master?.length) return Promise.resolve();
    return getMasterData(channel, cancelToken);
  };

  const fetchData = (cancelToken: CancelToken) => {
    const getAdjustmentTypeType = checkMasterData(
      masterDataStore?.rewardAdjustmentTypeList,
      'REWARD_ADJUST_TYPE',
      cancelToken
    );

    Promise.all([getAdjustmentTypeType])
      .then(([_adjustType]) => {
        setMasterDataStore((prev: RewardMasterStateType) => ({
          ...prev,
          ...(_adjustType && { rewardAdjustmentTypeList: _adjustType }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  const onChangeInput = ({ name, value }: ChangeEventBaseType<string | boolean>) => {
    setAdjustmentRewardForm({ ...adjustmentRewardForm, [name]: value });
  };

  const onChangeCommaInput = ({ name, value }: ChangeEventBaseNumberType<string | number>) => {
    setAdjustmentRewardForm({ ...adjustmentRewardForm, [name]: value });
  };

  const handleSubmitAdjustReward = async () => {
    const success = await onSubmitAdjust(adjustmentRewardForm);
    if (success) {
      setAdjustmentRewardForm(initAdjustmentRewardForm);
    }
  };

  const onClearAdjustForm = () => setAdjustmentRewardForm(initAdjustmentRewardForm);

  return {
    isMasterLoading,
    adjustmentRewardForm,
    methodsForm,
    masterDataStore,
    rewardAdjustmentTypeList: masterDataStore?.rewardAdjustmentTypeList,
    onChangeInput,
    onChangeCommaInput,
    handleSubmitAdjustReward: methodsForm?.handleSubmit(handleSubmitAdjustReward),
    onClearAdjustForm,
  };
};

export default useAdjustmentReward;
