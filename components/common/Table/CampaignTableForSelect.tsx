import { useEffect, useMemo, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { ActionButton, Status } from '@/components/features/campaign/components';
import { isPagePermission } from '@/utilities/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { Permission } from '@/constants/auth';
import Pagination from './Pagination';
import { Loader } from '@/components/Loader';
import { ChangeEventBaseType } from '@/types/event.interface';
import { useSortableTable } from '@/hooks/useSortableTable';
import { numberWithCommasToFixed } from '@/utilities/format';
import { Checkbox } from '@/components/common/Checkbox';
import { FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CampaignForOperationReportFormType } from '@/types/report.type';

interface PropsType {
  isLoading: boolean;
  dataList: any[];
  authorizedUser: AuthorizedUserType;
  onUpdateCampaignList: (campaingList: string[]) => void;
}

const columns: any[] = [
  { label: 'Campaign Code', accessor: 'code', sortable: true, className: '' },
  { label: 'Campaign Name', accessor: 'name', sortable: true, className: 'min-w-[160px]' },
  { label: 'Building', accessor: 'building', sortable: true, className: '' },
  { label: 'Campaign Period', accessor: 'startDateTime', sortable: true, className: '' },
  { label: 'Campaign Cost', accessor: 'cost', sortable: true, className: '' },
  { label: 'Campaign Status', accessor: 'status', sortable: true, className: '' },
];

const initFilterReportForm: CampaignForOperationReportFormType = {
  selectCampaign: [],
};

const CampaignTableForSelect = ({ isLoading, dataList, authorizedUser, onUpdateCampaignList }: PropsType) => {
  const { tableData, handleSorting } = useSortableTable(dataList, columns);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterReportForm, setFilterReportForm] = useState<CampaignForOperationReportFormType>(initFilterReportForm);

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

  const onChangeInput = ({ name, value, data }: ChangeEventBaseType<string | boolean>) => {
    if (name === 'selectForReport') {
      const initParams = filterReportForm.selectCampaign;
      if (initParams?.includes(data) && !value) {
        if (!value) initParams?.splice(initParams?.indexOf(data), 1);
      } else if (value) {
        initParams?.push(data);
      }

      setFilterReportForm({ selectCampaign: initParams });
    }
  };

  const schema = useMemo(() => {
    return yup.object().shape({
      buildingCode: yup.string().required('กรุณาระบุ'),
      receiptDateStringFrom: yup.string().required('กรุณาระบุ'),
      receiptDateStringTo: yup.string().required('กรุณาระบุ'),
    });
  }, [filterReportForm]);

  const methodsForm = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    onUpdateCampaignList(filterReportForm?.selectCampaign || []);
  }, [filterReportForm]);

  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-md w-full">
      <FormProvider {...methodsForm}>
        <table className="table-auto border-collapse w-full">
          <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg w-full border-b border-blue-sea/30 py-2">
            <tr>
              <th className="px-1 py-3 w-[80px]">Action</th>
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
            </tr>
          </thead>
          {currentTableData?.length ? (
            <tbody className="text-center text-[14px] bg-white-ghost body-table">
              {currentTableData?.map((_campaign, index) => (
                <tr
                  key={_campaign?.code}
                  className="hover:bg-blue-light/20 hover:cursor-pointer border-b border-gray-gainsboro"
                >
                  <td>
                    <Checkbox
                      key={_campaign?.code}
                      checked={filterReportForm?.selectCampaign?.includes(_campaign?.code)}
                      label={''}
                      name={'selectForReport'}
                      value={_campaign?.code}
                      onChange={onChangeInput}
                      className="justify-center"
                    />
                  </td>
                  <td className="min-w-[120px]">{_campaign?.code}</td>
                  <td
                    data-tooltip-id="campaign-tooltip"
                    data-tooltip-content={_campaign.name}
                    className="text-truncate max-w-[1px]"
                  >
                    {_campaign?.name}
                  </td>
                  <td className="max-w-[200px]">{_campaign?.building}</td>
                  <td className="min-w-[154px]">{_campaign?.period}</td>
                  <td className="min-w-[130px]">{numberWithCommasToFixed(_campaign?.cost, 2)}</td>
                  <td className="w-[130px]">
                    <Status theme={_campaign?.status?.toUpperCase()} />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </FormProvider>
      {isLoading ? (
        <Loader />
      ) : !currentTableData?.length ? (
        <div className="flex w-full justify-center min-h-[100px] items-center  bg-blue-light/10">
          ไม่พบข้อมูลของแคมเปญ
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

export default CampaignTableForSelect;
