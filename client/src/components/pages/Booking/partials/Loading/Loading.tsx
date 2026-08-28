import styles from './Loading.module.css'

function SkeletonCard() {
    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <div className={styles.badge} />
                <div className={styles.info}>
                    <div className={`${styles.line} ${styles.lineTitle}`} />
                    <div className={`${styles.line} ${styles.lineMeta}`} />
                    <div className={`${styles.line} ${styles.lineMetaShort}`} />
                </div>
            </div>
            <div className={styles.button} />
        </div>
    )
}

export function Loading() {
    return (
        <div className={styles.container}>
            <SkeletonCard />
            <SkeletonCard />
        </div>
    )
}
