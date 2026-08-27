import styles from './Dropdown.module.css'
import arrow from '../../assets/chevron-down.svg'
import type { ReactNode } from 'react'

interface BaseElement {
    id: string | number
    name: string | number
}

interface DropdownProps<T extends BaseElement> {
    items: T[]
    setItem: (value: T) => void
    activeItem: T | null
    title: string
    titleClassName?: string
    className?: string
    leadingIcon?: ReactNode
}

export function Dropdown<T extends BaseElement>({
    title,
    items,
    setItem,
    activeItem,
    titleClassName,
    className,
    leadingIcon,
}: DropdownProps<T>) {
    const dropdownClassName = [styles.dropdown, className].filter(Boolean).join(' ')

    return (
        <div className={styles.wrapper}>
            <span className={titleClassName}>{title}</span>
            <div className={dropdownClassName} tabIndex={0}>
                <div className={styles.activeItem}>
                    {leadingIcon ? <span className={styles.leadingIcon}>{leadingIcon}</span> : null}
                    <span className={styles.activeItemText}>{activeItem?.name || ''}</span>
                    <img src={arrow} alt="" />
                </div>
                <div className={styles.variants}>
                    {items.map((item) => (
                        <div
                            className={styles.element}
                            key={item.id}
                            onClick={() => setItem(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { styles as dropdownStyles }
