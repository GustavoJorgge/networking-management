'use client'
import { FC, ReactNode } from "react"

interface CardProps {
  title?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

const Card: FC<CardProps> = ({ title, footer, children, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 shadow-sm rounded-lg p-4 transition-transform hover:shadow-md ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>}
      <div className="mb-3">{children}</div>
      {footer && <div className="text-xs text-gray-500">{footer}</div>}
    </div>
  )
}

export default Card