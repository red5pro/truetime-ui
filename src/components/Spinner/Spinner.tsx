import { keyframes, styled } from '@mui/material/styles';
import { useUiText } from '../../text/UiText.js';

export type SpinnerType = 'circle' | 'dots' | 'ring' | 'bars';

export interface SpinnerProps {
  type?: SpinnerType;
  /** Diameter in px for `circle` and `ring`. */
  size?: number;
  color?: string;
  /** Stroke width in px for `circle`. */
  thickness?: number;
  /** Accessible name announced to assistive technology. */
  label?: string;
  className?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const barsScale = keyframes`
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1.0); }
`;

interface ShapeProps {
  spinnerColor: string;
  size?: number;
  thickness?: number;
  delay?: number;
}

const forwardShape = (prop: string) =>
  !['spinnerColor', 'size', 'thickness', 'delay'].includes(prop);

const Circle = styled('span', { shouldForwardProp: forwardShape })<ShapeProps>(
  ({ size = 40, spinnerColor, thickness = 4 }) => ({
    display: 'block',
    boxSizing: 'border-box',
    width: size,
    height: size,
    border: `${thickness}px solid rgba(255, 255, 255, 0.2)`,
    borderTop: `${thickness}px solid ${spinnerColor}`,
    borderRadius: '50%',
    animation: `${spin} 1s linear infinite`,
  }),
);

const Ring = styled('span', { shouldForwardProp: forwardShape })<ShapeProps>(
  ({ size = 40, spinnerColor }) => ({
    display: 'inline-block',
    width: size,
    height: size,
    '&:after': {
      content: '""',
      display: 'block',
      width: size * 0.8,
      height: size * 0.8,
      margin: size * 0.1,
      borderRadius: '50%',
      border: `${size * 0.05}px solid ${spinnerColor}`,
      borderColor: `${spinnerColor} transparent ${spinnerColor} transparent`,
      animation: `${spin} 1.2s linear infinite`,
    },
  }),
);

const Row = styled('span')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Dot = styled('span', { shouldForwardProp: forwardShape })<ShapeProps>(
  ({ delay = 0, spinnerColor }) => ({
    width: 8,
    height: 8,
    backgroundColor: spinnerColor,
    borderRadius: '50%',
    animation: `${pulse} 1.4s ease-in-out ${delay}s infinite`,
  }),
);

const Bar = styled('span', { shouldForwardProp: forwardShape })<ShapeProps>(
  ({ delay = 0, spinnerColor }) => ({
    width: '4px',
    height: '100%',
    backgroundColor: spinnerColor,
    animation: `${barsScale} 1s ${delay}s infinite ease-in-out`,
  }),
);

function SpinnerShape({
  type,
  size,
  color,
  thickness,
}: Required<Omit<SpinnerProps, 'label' | 'className'>>) {
  switch (type) {
    case 'dots':
      return (
        <Row sx={{ gap: '4px', padding: '6px' }}>
          {[0, 0.2, 0.4].map((delay) => (
            <Dot key={delay} spinnerColor={color} delay={delay} />
          ))}
        </Row>
      );
    case 'ring':
      return <Ring size={size} spinnerColor={color} />;
    case 'bars':
      return (
        <Row sx={{ gap: '2px', height: '40px' }}>
          {[0, 0.1, 0.2, 0.3, 0.4].map((delay) => (
            <Bar key={delay} spinnerColor={color} delay={delay} />
          ))}
        </Row>
      );
    case 'circle':
    default:
      return <Circle size={size} spinnerColor={color} thickness={thickness} />;
  }
}

/** Loading indicator; the four shapes match the Meetings CustomSpinner variants. */
export function Spinner({
  type = 'circle',
  size = 40,
  color = 'white',
  thickness = 4,
  label,
  className,
}: SpinnerProps) {
  const text = useUiText();
  return (
    <span
      role="progressbar"
      aria-label={label ?? text.loading}
      className={className}
      style={{ display: 'inline-block' }}
    >
      <SpinnerShape type={type} size={size} color={color} thickness={thickness} />
    </span>
  );
}
