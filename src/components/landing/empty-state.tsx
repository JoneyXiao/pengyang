interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 px-6 py-12">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
