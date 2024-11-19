const LeftArrow = ({ className = "" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`stroke-current ${className}`}
  >
    <path d="M18 2L6 14L18 26" strokeLinecap="round" />
  </svg>
);

export default LeftArrow;
