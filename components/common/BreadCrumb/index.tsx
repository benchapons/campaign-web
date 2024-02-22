import React, { FC } from 'react';
import { useRouter } from 'next/router';

import styles from './BreadCrumb.module.css';

interface List {
  label: string;
  pathName: string;
  testId?: string;
}

interface BreadCrumbProps {
  list: List[];
  testId?: string;
}

const BreadCrumb: FC<BreadCrumbProps> = ({ list, testId = '' }) => {
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  return (
    <nav aria-label="breadcrumb" test-id={testId ? `breadcrumb-${testId}` : 'breadcrumb'}>
      <ol className={styles.breadcrumb}>
        {list?.map((i: List, idx: number) => (
          <li key={i?.label}>
            <button
              test-id={i?.testId || idx}
              className={idx === list.length - 1 ? styles.active : ''}
              onClick={() => handleClick(i?.pathName)}
            >
              {i?.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
