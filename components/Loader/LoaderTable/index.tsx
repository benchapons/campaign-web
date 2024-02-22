import styles from './LoaderTable.module.css';

const LoaderTable = () => {
  return (
    <div className={styles['loading-core']}>
      <div className={styles.loaderTable} />
      <div className={styles['text-center']}>Processing, please wait...</div>
    </div>
  );
};

export default LoaderTable;
