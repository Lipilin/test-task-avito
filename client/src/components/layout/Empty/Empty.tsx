import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Empty.module.css'

interface EmptyProps {
    icon: string
    title: string
    description: ReactNode
    actionLabel: string
    onAction?: () => void
    actionHref?: string
    variant?: 'default' | 'accent'
}

export function Empty({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    actionHref,
    variant = 'default',
}: EmptyProps) {
    const iconWrapperClassName = [
        styles.iconWrapper,
        variant === 'accent' ? styles.iconWrapperAccent : '',
    ].filter(Boolean).join(' ')

    const actionClassName = styles.button

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={iconWrapperClassName}>
                    <img src={icon} alt="" className={styles.icon} />
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                {actionHref ? (
                    <Link to={actionHref} className={actionClassName}>
                        {actionLabel}
                    </Link>
                ) : (
                    <button type="button" className={actionClassName} onClick={onAction}>
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    )
}
