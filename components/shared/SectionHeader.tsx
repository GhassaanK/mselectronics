type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-xl max-w-2xl">
      {eyebrow ? <p className="mb-sm text-sm font-semibold uppercase tracking-normal text-accent">{eyebrow}</p> : null}
      <h2 className="heading-tight text-3xl text-foreground md:text-4xl">{title}</h2>
      {description ? <p className="mt-md text-base leading-relaxed text-muted">{description}</p> : null}
    </div>
  )
}
