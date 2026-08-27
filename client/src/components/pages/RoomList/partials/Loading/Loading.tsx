import styles from './Loading.module.css'

function SkeletonCard() {
    return (
        <div className={styles.card}>
            <div className={`${styles.line} ${styles.lineTitle}`} />
            <div className={`${styles.line} ${styles.lineSubtitle}`} />
            <div className={styles.metaRow}>
                <div className={styles.metaDot} />
                <div className={`${styles.line} ${styles.metaLine}`} />
            </div>
            <div className={styles.metaRow}>
                <div className={styles.metaDot} />
                <div className={`${styles.line} ${styles.metaLine}`} />
            </div>
            <div className={`${styles.line} ${styles.lineBadge}`} />
            <div className={styles.buttons}>
                <div className={`${styles.line} ${styles.lineButton}`} />
                <div className={`${styles.line} ${styles.lineButton}`} />
            </div>
        </div>
    )
}

export function Loading() {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Загрузка переговорных...</h3>
            <div className={styles.grid}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    )
}
