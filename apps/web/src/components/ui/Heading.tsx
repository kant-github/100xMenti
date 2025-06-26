interface DashboardComponentHeadingProps {
    children: React.ReactNode,
    description: string
    className?: string
}


export default function Heading({ children, description, className }: DashboardComponentHeadingProps) {
    return (
        <span className={`${className} text-lightText dark:text-neutral-100 flex flex-col`}>
            <span className="text-lg font-bold tracking-wide">{children}</span>
            <span className="text-xs font-normal tracking-wide">{description}</span>
        </span>
    )
}