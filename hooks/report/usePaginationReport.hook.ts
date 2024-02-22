import { ChangeEventBaseType } from '@/types/event.interface';
import { ChangeEvent, useMemo, useState } from 'react';

const usePaginationReport = <T>(
  data: T[] = [],
  setUpSizePage: number = 10,
  callBackFetchData: (page: number, sizePage: number) => void = () => { },
  totalData: number = 0
) => {
  const [page, setPage] = useState<number>(1);
  const [sizePage, setSizePage] = useState<number>(setUpSizePage);

  const reportListPage = useMemo<T[]>(() => {
    return data;
  }, [page, data, sizePage]);

  const handlePerPage = (event: ChangeEventBaseType<string>) => {
    setSizePage(parseInt(event.value));
    callBackFetchData?.(page, parseInt(event.value));
  };

  const handlePage = (pageSelect: number) => {
    setPage(pageSelect);
    callBackFetchData?.(pageSelect, sizePage);
  };

  const firstPage = () => {
    setPage(1);
    callBackFetchData?.(1, sizePage);
  };

  const finalPage = () => {
    let totalList = 0;
    if (totalData) {
      totalList = totalData;
    } else {
      totalList = data.length;
    }
    setPage(Math.ceil(totalList / sizePage));
    callBackFetchData?.(Math.ceil(totalList / sizePage), sizePage);
  };

  return {
    page,
    sizePage,
    reportListPage,
    setPage,
    handlePerPage,
    handlePage,
    firstPage,
    finalPage,
  };
};

export default usePaginationReport;
