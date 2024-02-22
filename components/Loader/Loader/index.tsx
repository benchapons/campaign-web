import styles from './Loader.module.css';

const Loader = () => (
  <div className={`${styles.container} bg-black/50`}>
    <div className={styles['lds-grid']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loader;
