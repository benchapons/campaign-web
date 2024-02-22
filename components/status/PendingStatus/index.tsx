import styles from './Pending.module.css';

const PendingStatus = () => {
  return (
    <div className={styles['loading-core']}>
      <div className={styles.loaderTable} />
    </div>
  );
};

export default PendingStatus;
