import dynamic from 'next/dynamic';
import { TableColumn } from 'react-data-table-component';

import { LoaderTable } from '@/components/Loader';

const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

interface TableProps {
  isLoading?: boolean;
  columns: TableColumn<unknown>[] | any;
  dataList: any[];
}

const customTableStyles = {
  rows: {
    style: {
      fontSize: '14px',
      alignItems: 'start',
      paddingTop: '8px',
      paddingBottom: '8px',
    },
  },
  headRow: {
    style: {
      background: 'linear-gradient(320deg, rgba(175,211,226,0.4) 0%, rgba(25,167,206,0.4) 100%)',
      borderTopLeftRadius: '0.375rem',
      borderTopRightRadius: '0.375rem',
    },
  },
  headCells: {
    style: {
      fontSize: '16px',
      textAlign: 'start',
    },
  },
  subHeader: {
    style: {
      backgroundColor: 'red',
      minHeight: '52px',
    },
  },
};

const Table = ({ isLoading = false, columns, dataList }: TableProps) => {
  return (
    <DataTable
      noDataComponent={'ไม่พบข้อมูล'}
      noHeader={true}
      striped={true}
      highlightOnHover={true}
      customStyles={customTableStyles}
      columns={columns}
      data={dataList}
      pagination
      paginationPerPage={10}
      paginationComponentOptions={{
        rowsPerPageText: 'แสดงหน้าละ:',
        rangeSeparatorText: 'จาก',
      }}
      progressPending={isLoading}
      progressComponent={<LoaderTable />}
    />
  );
};

export default Table;
