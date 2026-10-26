import Svg, { Line, Path, Polyline } from 'react-native-svg';

// Minimal 1.5px line icons, matching the mockup.
type IconProps = { size?: number; color?: string; strokeWidth?: number };

function base(size: number, color: string, strokeWidth: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

export function PlusIcon({ size = 24, color = '#000', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg {...base(size, color, strokeWidth)}>
      <Line x1="12" x2="12" y1="5" y2="19" />
      <Line x1="5" x2="19" y1="12" y2="12" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 24, color = '#000', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg {...base(size, color, strokeWidth)}>
      <Path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

export function TrashIcon({ size = 20, color = '#000', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg {...base(size, color, strokeWidth)}>
      <Path d="M3 6h18" />
      <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <Line x1="10" x2="10" y1="11" y2="17" />
      <Line x1="14" x2="14" y1="11" y2="17" />
    </Svg>
  );
}

export function CheckIcon({ size = 12, color = '#fff', strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg {...base(size, color, strokeWidth)}>
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

export function LogOutIcon({ size = 22, color = '#000', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg {...base(size, color, strokeWidth)}>
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Polyline points="16 17 21 12 16 7" />
      <Line x1="21" x2="9" y1="12" y2="12" />
    </Svg>
  );
}
