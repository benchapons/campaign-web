import { DOTS, usePagination } from '@/hooks/usePagination';
import classes from '@/components/common/Table/Pagination/pagination.module.css';
import TableDropdown from './TableDropdown';
import { ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';

interface PropsType {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  siblingCount?: number;
  className?: string;
  onPageChange: (data: number) => void;
  onPageSizeChange: (data: ChangeEventBaseType<string>) => void;
}

const pageSizeList: OptionsDropdown[] = [
  { id: '10', label: '10', value: '10' },
  { id: '15', label: '15', value: '15' },
  { id: '20', label: '20', value: '20' },
  { id: '25', label: '25', value: '25' },
  { id: '30', label: '30', value: '30' },
  { id: '35', label: '35', value: '35' },
  { id: '40', label: '40', value: '40' },
  { id: '45', label: '45', value: '45' },
  { id: '50', label: '50', value: '50' },
];

const Pagination = ({
  totalCount,
  currentPage,
  pageSize,
  siblingCount,
  className,
  onPageChange,
  onPageSizeChange,
}: PropsType) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div className="flex justify-between items-center px-2  py-3">
      <p className="text-sm text-gray">
        showing {currentPage * pageSize - (pageSize - 1)} -{' '}
        {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} of {totalCount}
      </p>
      <div className="flex items-center">
        <div className="max-w-[90px]">
          <TableDropdown
            name="pageSize"
            options={pageSizeList}
            value={pageSize?.toString()}
            onChange={onPageSizeChange}
          />
        </div>

        <ul className={`${classes['pagination-container']} ${className || ''}`}>
          <li
            test-id="left"
            className={`${classes['pagination-item']} ${currentPage === 1 ? classes['disabled'] : ''}`}
            onClick={onPrevious}
          >
            <div className={`${classes['arrow']} ${classes['left']}`} />
          </li>
          {paginationRange.map((pageNumber) => {
            if (pageNumber === DOTS) {
              return (
                <li key={pageNumber} className={`${classes['pagination-item']} ${classes['dots']}`}>
                  &#8230;
                </li>
              );
            }

            return (
              <li
                key={pageNumber}
                test-id={pageNumber}
                className={`${classes['pagination-item']} ${pageNumber === currentPage ? classes['selected'] : ''}`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </li>
            );
          })}
          <li
            test-id="right"
            className={`${classes['pagination-item']} ${currentPage === lastPage ? classes['disabled'] : ''}`}
            onClick={onNext}
          >
            <div className={`${classes['arrow']} ${classes['right']}`} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
