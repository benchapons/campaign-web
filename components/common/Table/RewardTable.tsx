import { useMemo, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

import ActionButton from '@/components/features/reward/ActionButton';
import { isPagePermission } from '@/utilities/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { Permission } from '@/constants/auth';
import { Loader } from '@/components/Loader';
import Pagination from './Pagination';
import { ChangeEventBaseType } from '@/types/event.interface';
import { useSortableTable } from '@/hooks/useSortableTable';
import { numberWithCommas } from '@/utilities/format';

interface PropsType {
  isLoading: boolean;
  dataList: any[];
  authorizedUser: AuthorizedUserType;
  onClickEdit: (rewardId: string) => void;
  onClickAuditLog: (rewardId: string) => void;
  onClickDelete: (rewardId: string, rewardName: string) => void;
}

const columns: any[] = [
  { label: 'Reward Type', accessor: 'type', sortable: true, className: '' },
  { label: 'Reward Name', accessor: 'name', sortable: true, className: 'min-w-[200px]' },
  { label: 'Reward Quantity', accessor: 'quantity', sortable: true, className: '' },
  { label: 'Reward Value', accessor: 'value', sortable: true, className: '' },
  { label: 'Modify Name', accessor: 'modifyName', sortable: true, className: 'w-[130px]' },
  { label: 'Modify Date', accessor: 'modifyDateTime', sortable: true, className: '' },
];

const RewardTable = ({
  isLoading,
  dataList,
  authorizedUser,
  onClickEdit,
  onClickAuditLog,
  onClickDelete,
}: PropsType) => {
  const { tableData, handleSorting } = useSortableTable(dataList, columns);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('');

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return tableData.slice(firstPageIndex, lastPageIndex);
  }, [tableData, currentPage, pageSize, order, sortField]);

  const onChangePageSize = (data: ChangeEventBaseType) => {
    setPageSize(+data?.value);
  };

  const handleSortingChange = (accessor: string) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
    setCurrentPage(1);
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-md w-full">
      <table className="table-auto border-collapse w-full">
        <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg w-full border-b border-blue-sea/30 py-2">
          <tr>
            {columns?.map((column) => (
              <th
                key={column?.accessor}
                className={`px-1 py-3 ${column?.className} cursor-pointer relative`}
                onClick={column?.sortable ? () => handleSortingChange(column?.accessor) : () => {}}
              >
                {column?.label}
                <div className="absolute right-0 top-[32%]">
                  {column?.sortable ? (
                    sortField === column?.accessor && order === 'asc' ? (
                      <FaCaretUp className="text-orange text-lg" />
                    ) : sortField === column?.accessor && order === 'desc' ? (
                      <FaCaretDown className="text-orange text-lg" />
                    ) : null
                  ) : null}
                </div>
              </th>
            ))}
            <th className="px-1 py-3  max-w-[150px]">Action</th>
          </tr>
        </thead>
        {currentTableData?.length ? (
          <tbody className="text-center text-[14px] bg-white-ghost body-table">
            {currentTableData?.map((_reward, idx) => (
              <tr
                key={`${_reward?.type}-${idx}`}
                className="hover:bg-blue-light/20 hover:cursor-pointer border-b border-gray-gainsboro"
              >
                <td className="min-w-[120px]">{_reward?.type}</td>
                <td
                  data-tooltip-id="reward-tooltip"
                  data-tooltip-content={_reward.name}
                  className="text-truncate max-w-[1px]"
                >
                  {_reward?.name}
                </td>
                <td className="w-[150px]">{numberWithCommas(_reward?.quantity)}</td>
                <td className="w-[120px]">{numberWithCommas(_reward?.value)}</td>
                <td className="text-truncate max-w-[1px]">{_reward?.modifyName}</td>
                <td className="min-w-[130px]">{_reward?.modifyDate}</td>
                <td className="w-[100px]">
                  <ActionButton
                    isPermissionDelete={isPagePermission(authorizedUser, [Permission.RWD_DELETE])}
                    isPermissionEdit={isPagePermission(authorizedUser, [Permission.RWD_UPDATE])}
                    isPermissionAuditLog={isPagePermission(authorizedUser, [Permission.VW_AUDIT_LOG])}
                    index={idx}
                    onClickEdit={() => onClickEdit(_reward?._id)}
                    onClickDelete={() => onClickDelete(_reward?._id, _reward?.name)}
                    onClickAuditLog={() => onClickAuditLog(_reward?._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
      {isLoading ? (
        <Loader />
      ) : !currentTableData?.length ? (
        <div className="flex w-full justify-center min-h-[100px] items-center  bg-blue-light/10">
          ไม่พบข้อมูลของรางวัล
        </div>
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

export default RewardTable;
