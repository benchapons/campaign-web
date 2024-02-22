import ForbiddenImage from '@/public/icons/forbidden.png';
import Image from 'next/image';

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center h-screen gap-12">
      <Image alt="ForbiddenImage" src={ForbiddenImage} width={120} className="opacity-50" />
      <div className="text-[50px] my-4 opacity-30 font-semibold"> 403 | Forbidden</div>
    </div>
  );
};

export default Forbidden;
