// interface Props {
//   width?: number;
//   height?: number;
//   circle?: boolean;
//   rounded?: boolean;
//   unit?: string;
//   animation?: boolean;
//   color?: string;
//   style?: React.CSSProperties;
// }

// //pulseKeyframe
// const pulseKeyframe = keyframes`
//     0% {
//       opacity: 1;
//     }
//     50% {
//       opacity: 0.4;
//     }
//     100% {
//       opacity: 1;
//     }
//   `;
// //pulseAnimation
// const pulseAnimation = css`
//   animation: ${pulseKeyframe} 1.5s ease-in-out 0.5s infinite;
// `;

// const Base = styled.span<Props>`
//   ${({ color }) => color && `background-color: ${color}`};
//   ${({ rounded }) => rounded && `border-radius: 8px`};
//   ${({ circle }) => circle && `border-radius: 50%`};
//   ${({ width, height }) => (width || height) && `display: block`};
//   ${({ animation }) => animation && pulseAnimation};
//   width: ${({ width, unit }) => width && unit && `${width}${unit}`};
//   height: ${({ height, unit }) => height && unit && `${height}${unit}`};
// `;
// const Content = styled.span`
//   opacity: 0;
// `;

// const Skeleton: React.FC<Props> = ({
//   animation = true,
//   children,
//   width,
//   height,
//   circle,
//   rounded,
//   unit = "px",
//   color = "#F4F4F4",
//   style
// }) => {
//   const styles = {
//     style: style,
//     rounded: rounded,
//     circle: circle,
//     width: width,
//     height: height,
//     animation: animation,
//     unit: unit,
//     color: color
//   };

//   return (
//     <Base {...styles}>
//       <Content></Content>
//     </Base>
//   );
// };

// 스켈레톤 작업중
