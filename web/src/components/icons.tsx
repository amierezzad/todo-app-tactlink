// Minimal 1.5px line icons, matching the mockup.
type IconProps = { size?: number; strokeWidth?: number; className?: string }

function Svg({
  size,
  strokeWidth,
  className,
  children,
}: Required<Pick<IconProps, 'size' | 'strokeWidth'>> & { className?: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

export const PlusIcon = ({ size = 24, strokeWidth = 1.5, className }: IconProps) => (
  <Svg size={size} strokeWidth={strokeWidth} className={className}>
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="5" x2="19" y1="12" y2="12" />
  </Svg>
)

export const ChevronLeftIcon = ({ size = 24, strokeWidth = 1.5, className }: IconProps) => (
  <Svg size={size} strokeWidth={strokeWidth} className={className}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
)

export const TrashIcon = ({ size = 20, strokeWidth = 1.5, className }: IconProps) => (
  <Svg size={size} strokeWidth={strokeWidth} className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </Svg>
)

export const CheckIcon = ({ size = 12, strokeWidth = 2.5, className }: IconProps) => (
  <Svg size={size} strokeWidth={strokeWidth} className={className}>
    <polyline points="20 6 9 17 4 12" />
  </Svg>
)

export const LogOutIcon = ({ size = 22, strokeWidth = 1.5, className }: IconProps) => (
  <Svg size={size} strokeWidth={strokeWidth} className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </Svg>
)
