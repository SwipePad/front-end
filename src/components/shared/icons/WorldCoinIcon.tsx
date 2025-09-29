import { CSSProperties } from "react";

const WorldCoinSmallIcon = ({ style }: { style?: CSSProperties }) => (
  <svg
    width={17}
    height={18}
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <g clipPath="url(#clip0_926_5723)">
      <rect x="0.854492" y="0.941895" width="16.1165" height="16.1165" rx="8.05823" fill="white" />
      <mask
        id="mask0_926_5723"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x={-2}
        y={-2}
        width={22}
        height={22}
      >
        <path d="M19.6632 -1.74219H-1.82166V19.7426H19.6632V-1.74219Z" fill="white" />
      </mask>
      <g mask="url(#mask0_926_5723)">
        <mask
          id="mask1_926_5723"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x={-20}
          y={-20}
          width={58}
          height={58}
        >
          <path d="M-19.7692 -19.6958H37.6226V37.696H-19.7692V-19.6958Z" fill="white" />
        </mask>
        <g mask="url(#mask1_926_5723)">
          <path
            d="M15.1202 5.2251L8.84027 5.23502C6.76087 5.23502 5.07507 6.92082 5.07507 9.00022C5.07507 11.0796 6.76087 12.7654 8.84027 12.7654H14.8877"
            stroke="black"
            strokeWidth="1.51057"
            strokeMiterlimit={10}
            strokeLinecap="round"
          />
          <path
            d="M1.71155 9H16.2178"
            stroke="black"
            strokeWidth="1.51057"
            strokeMiterlimit={10}
            strokeLinecap="round"
          />
          <path
            d="M8.9122 1.69727C12.9455 1.69727 16.2151 4.96691 16.2151 9.00021C16.2151 13.0335 12.9455 16.3032 8.9122 16.3032C4.8789 16.3032 1.60925 13.0335 1.60925 9.00021C1.60925 4.96691 4.8789 1.69727 8.9122 1.69727Z"
            stroke="black"
            strokeWidth="1.51057"
            strokeMiterlimit={10}
            strokeLinecap="round"
          />
        </g>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_926_5723">
        <rect
          x="0.854492"
          y="0.941895"
          width="16.1165"
          height="16.1165"
          rx="8.05823"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);

const WhiteWorldCoinSmallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" fill="none">
    <g clipPath="url(#clip0_885_17083)">
      <mask
        id="mask0_885_17083"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x={-2}
        y={-2}
        width={19}
        height={20}
      >
        <path d="M16.7136 -1.36951H-1.94971V17.2938H16.7136V-1.36951Z" fill="white" />
      </mask>
      <g mask="url(#mask0_885_17083)">
        <mask
          id="mask1_885_17083"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x={-18}
          y={-17}
          width={51}
          height={50}
        >
          <path d="M-17.5409 -16.9661H32.314V32.8888H-17.5409V-16.9661Z" fill="white" />
        </mask>
        <g mask="url(#mask1_885_17083)">
          <path
            d="M12.7664 4.68189L7.31115 4.69052C5.50481 4.69052 4.04041 6.15493 4.04041 7.96126C4.04041 9.76759 5.50481 11.232 7.31115 11.232H12.5644"
            stroke="white"
            strokeWidth="1.3122"
            strokeMiterlimit={10}
            strokeLinecap="round"
          />
          <path
            d="M1.11829 7.96192H13.7195"
            stroke="white"
            strokeWidth="1.3122"
            strokeMiterlimit={10}
            strokeLinecap="round"
          />
          <path
            d="M7.37527 1.61768C10.8789 1.61768 13.7192 4.45795 13.7192 7.96159C13.7192 11.4652 10.8789 14.3055 7.37527 14.3055C3.87164 14.3055 1.03137 11.4652 1.03137 7.96159C1.03137 4.45795 3.87164 1.61768 7.37527 1.61768Z"
            stroke="white"
            strokeWidth="1.3122"
            strokeMiterlimit={10}
            strokeLinecap="round"
          />
        </g>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_885_17083">
        <rect width={14} height={14} fill="white" transform="translate(0.375122 0.961851)" />
      </clipPath>
    </defs>
  </svg>
);

export { WorldCoinSmallIcon, WhiteWorldCoinSmallIcon };
