import { useMemo, useState } from 'react';
import Pagination from './Pagination';
import { Loader } from '@/components/Loader';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { formatDateTimeThai } from '@/utilities/format';
import { isEmpty } from 'lodash';
import { ChangeEventBaseType } from '@/types/event.interface';

interface PropsType {
  isLoading?: boolean;
  dataList: any[];
  onExpend: (selectedId: number, isExpend: boolean) => void;
}

const AuditLogTable = ({ isLoading, dataList, onExpend }: PropsType) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return dataList.slice(firstPageIndex, lastPageIndex);
  }, [dataList, currentPage, pageSize]);

  const onChangePageSize = (data: ChangeEventBaseType) => {
    setPageSize(+data?.value);
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-md w-full">
      <table className="table-auto border-collapse w-full">
        <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg w-full border-b border-blue-sea/30 py-2">
          <tr>
            <th className="px-1 py-3"></th>
            <th className="px-1 py-3 w-[140px]">User</th>
            <th className="px-1 py-3">Channel</th>
            <th className="px-1 py-3 min-w-[190px]">Old</th>
            <th className="px-1 py-3 min-w-[190px]">New</th>
            <th className="px-1 py-3">Detail</th>
            <th className="px-1 py-3">Date</th>
          </tr>
        </thead>
        {currentTableData?.length ? (
          <tbody className="text-center text-[14px] bg-white-ghost body-table">
            {currentTableData?.map((_auditLog, index) => {
              const dataForm = _auditLog?.from ? JSON.parse(_auditLog?.from) : '';
              delete dataForm?.__v;
              const newDataOld = !isEmpty(dataForm) ? JSON.stringify(dataForm, null, 2) : '-';
              const dataTo = _auditLog?.to ? JSON?.parse(_auditLog?.to) : '';
              delete dataTo?.__v;
              const newDataNew = !isEmpty(dataTo) ? JSON.stringify(dataTo, null, 2) : '-';
              return (
                <tr
                  key={index}
                  className="hover:bg-blue-light/20 hover:cursor-pointer border-b border-gray-gainsboro"
                  onClick={!_auditLog.isExpend ? () => onExpend(_auditLog?.id, _auditLog?.isExpend) : () => {}}
                >
                  <td className={`w-[20px] ${_auditLog?.isExpend ? 'align-top text-left' : ''}`}>
                    <button
                      test-id={`expand-${_auditLog?.id}`}
                      className="hover:bg-blue-light rounded-md p-1 text-blue-pacific"
                      onClick={() => onExpend(_auditLog?.id, _auditLog?.isExpend)}
                    >
                      {_auditLog.isExpend ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                  </td>
                  <td className={`text-truncate max-w-[1px] ${_auditLog?.isExpend ? 'align-top' : ''}`}>
                    {_auditLog?.createBy}
                  </td>
                  <td className={`w-[100px] ${_auditLog?.isExpend ? 'align-top' : ''}`}>
                    <div className="p-1 text-blue-steel rounded-md border-2 border-blue-fresh">
                      {_auditLog?.channel}
                    </div>
                  </td>
                  <td
                    className={`"min-w-[154px] ${
                      _auditLog?.isExpend
                        ? newDataOld !== '-'
                          ? 'align-top text-left whitespace-pre-line'
                          : 'align-top'
                        : 'text-center'
                    }`}
                  >
                    {!_auditLog?.isExpend
                      ? `${newDataOld === '-' ? newDataOld : `${newDataOld?.substring(0, 25)}...`}`
                      : newDataOld}
                  </td>
                  <td
                    className={`min-w-[154px]  ${
                      _auditLog?.isExpend
                        ? newDataNew !== '-'
                          ? 'align-top text-left whitespace-pre-line'
                          : 'align-top'
                        : 'text-center'
                    }`}
                  >
                    {!_auditLog?.isExpend
                      ? `${newDataNew === '-' ? newDataNew : `${newDataNew?.substring(0, 25)}...`}`
                      : newDataNew}
                  </td>
                  <td className={`w-[154px] ${_auditLog?.isExpend ? 'align-top' : ''}`}>{_auditLog?.detailMessage}</td>
                  <td className={`w-[130px] ${_auditLog?.isExpend ? 'align-top' : ''}`}>
                    {formatDateTimeThai(_auditLog.timestamp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : null}
      </table>
      {isLoading ? (
        <Loader />
      ) : !currentTableData?.length ? (
        <div className="flex w-full justify-center min-h-[100px] items-center  bg-blue-light/10">ไม่พบข้อมูล</div>
      ) : null}
      <Pagination
        currentPage={currentPage}
        totalCount={dataList.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={onChangePageSize}
      />
    </div>
  );
};

export default AuditLogTable;
