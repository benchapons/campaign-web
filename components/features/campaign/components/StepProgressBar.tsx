import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';

import { campaignDetailState } from '@/store/campaign';
import styles from '@/components/features/campaign/styles/StepProgressBar.module.css';
import { StepCampaignEnum } from '@/constants/enum';
import { MdChecklistRtl, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { GrInfo } from 'react-icons/gr';
import { IoInformationCircleOutline } from 'react-icons/io5';

const initDisabled = {
  one: false,
  two: true,
  three: true,
  four: true,
  five: true,
};

const StepProgressBar = () => {
  const [campaignStore, setCampaignStore] = useRecoilState(campaignDetailState);

  const [isDisabled, setIsDisabled] = useState(initDisabled);

  const onClickStep = (data: number) => {
    setCampaignStore({
      ...campaignStore,
      step: data,
    });
  };

  return (
    <div className={styles['stepper-wrapper']}>
      {/* <div className={`${styles['stepper-item']} ${campaignStore?.step > 1 ? styles.completed : styles.active}`}> */}
      <div
        className={`${styles['stepper-item']} ${
          campaignStore?.step === StepCampaignEnum?.INFORMATION && styles.active
        }`}
      >
        <button test-id="step-1" className={styles.btn} onClick={() => onClickStep(1)} disabled={isDisabled.one}>
          <div
            className={`${styles['step-counter']} ${
              campaignStore?.step === StepCampaignEnum?.INFORMATION && styles.active
            }`}
          >
            {campaignStore?.step > 1 ? (
              <FiCheckCircle className="text-blue-pacific" />
            ) : (
              <IoInformationCircleOutline className="text-blue-pacific text-xl" />
            )}
            <p className="pl-1">1.</p>
          </div>
          <div className={styles['step-name']}>Campaign Information</div>
        </button>
      </div>
      <div className="flex text-center items-center px-2">
        <MdOutlineKeyboardArrowRight className="text-2xl" />
      </div>
      <div
        className={`${styles['stepper-item']} ${campaignStore?.step === StepCampaignEnum?.CRITERIA && styles.active}`}
      >
        <button test-id="step-2" className={styles.btn} onClick={() => onClickStep(2)} disabled={isDisabled.two}>
          <div
            className={`${styles['step-counter']} ${
              campaignStore?.step === StepCampaignEnum?.CRITERIA && styles.active
            }`}
          >
            {campaignStore?.step > 2 ? (
              <FiCheckCircle className="text-blue-pacific" />
            ) : (
              <MdChecklistRtl
                className={`${
                  campaignStore?.step === StepCampaignEnum?.CRITERIA ? 'text-blue-pacific' : 'text-gray-dim'
                }`}
              />
            )}
            <p className="pl-1">2.</p>
          </div>
          <div className={styles['step-name']}>Campaign Criteria</div>
        </button>
      </div>
    </div>
  );
};

export default StepProgressBar;
