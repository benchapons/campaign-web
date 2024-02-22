import { useMemo } from 'react';
import { StatusCampaignEnum } from '@/constants/enum';

interface StatusProps {
  theme: StatusCampaignEnum;
}

const Status = ({ theme }: StatusProps) => {
  const styles = useMemo(
    () => ({
      ACTIVATED: 'border-green-forest text-green-forest bg-green-forest/20',
      INACTIVATED: 'border-red-coral text-red-coral bg-red-coral/20',
      DRAFTED: 'border-blue-steel text-blue-steel bg-blue-fresh/20',
    }),
    []
  );
  return <div className={`border px-1.5 py-0.5 rounded-lg text-sm ${styles[theme]}`}>{theme}</div>;
};

export default Status;
