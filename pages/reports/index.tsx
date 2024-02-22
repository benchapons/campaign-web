import { Loader } from '@/components/Loader';
import withSession from '@/hoc/withSession';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaCreditCard, FaTrophy } from 'react-icons/fa';
import { MdAssignment, MdReceiptLong } from 'react-icons/md';

const reports = [
  {
    title: 'Redemption Transaction by Condition',
    href: '/reports/redemption-transaction-condition',
    icon: <MdAssignment className="text-7xl " />,
  },
  {
    title: 'Redemption Transaction by Receipt',
    href: '/reports/redemption-transaction-receipt',
    icon: <MdReceiptLong className="text-7xl" />,
  },
  {
    title: 'Summary Redemption Reward',
    href: '/reports/summary-redemption-reward',
    icon: <FaTrophy className="text-7xl" />,
  },
  {
    title: 'Bank Promotion',
    href: '/reports/bank-promotion',
    icon: <FaCreditCard className="text-7xl" />,
  },
  {
    title: 'Receipt Transation Report',
    href: '/reports/receipt-transaction-report',
    icon: <FaCreditCard className="text-7xl" />,
  },
];

const ReportsPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleRoute = (path: string) => {
    setIsLoading(true);
    router.push(path);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {isLoading ? <Loader /> : null}
      <h1 className="text-2xl font-extrabold text-blue-cobalt">SELECT REPORT</h1>
      <ul className="grid grid-cols-2 gap-10 w-2/5 mt-4">
        {reports?.map((i) => (
          <li
            key={i?.href}
            className="flex flex-col items-center justify-center h-[216px] max-h-[216px] text-center p-4  bg-blue-fresh/20 rounded-md shadow hover:bg-blue-fresh/80 text-blue-pacific hover:text-blue-cerulean ease-in duration-300 cursor-pointer"
            onClick={() => handleRoute(i?.href)}
          >
            {i?.icon}
            <p className="text-sm mt-2">{i?.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default withSession(ReportsPage, { title: '', permission: [] });
