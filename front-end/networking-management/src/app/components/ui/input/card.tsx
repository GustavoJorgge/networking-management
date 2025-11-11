import React, { HTMLAttributes } from "react";

const Card = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm  p-4  ${className ?? ''}`} {...props} />
));
Card.displayName = 'Card'

const CardTitle = React.forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) =>
    (<h3 ref={ref} className={`flex items-center gap-2 text-1xl font-semibold leading-none tracking-tight justify-between flex-row-reverse ${className ?? ''}`} {...props} />)
);
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (<p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />));
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (<div ref={ref} className={` p-1 text-lg font-semibold ${className}`} {...props} />));
CardContent.displayName = 'CardContent'

const CardValue = React.forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (<p ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />));
CardValue.displayName = 'CardValue'

export { Card, CardContent, CardDescription, CardTitle, CardValue };

