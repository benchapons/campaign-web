import Button from '@/components/common/Button';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

interface PropsType {
  title: string;
  handleClickAuditLog: () => void;
  handleClickExport: () => void;
}

const HeaderReport = ({ title, handleClickAuditLog, handleClickExport }: PropsType) => {
  return (
    <header className="flex justify-between items-center px-5 pt-3 pb-2 border-b border-gray-gainsboro shadow-sm bg-white-ghost/50">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex justify-end gap-4">
        <Button name="audit-log" theme="warning" onClick={handleClickAuditLog}>
          Audit Logs
        </Button>
        <Button name="export" onClick={handleClickExport}>
          Export
        </Button>
      </div>
    </header>
  );
};

export default HeaderReport;
