import { useMemo } from 'react';
import { StatusMasterData } from '@/constants/enum';

interface StatusProps {
  theme: StatusMasterData;
}

const TagStatusMasterData = ({ theme }: StatusProps) => {
  const styles = useMemo(
    () => ({
      ACTIVE: 'border-green-forest text-green-forest bg-green-forest/20',
      INACTIVE: 'border-red text-red bg-red/20',
    }),
    []
  );
  return <div className={`border px-1.5 rounded-lg min-w-[90px] text-sm ${styles[theme]}`}>{theme}</div>;
};

export default TagStatusMasterData;
