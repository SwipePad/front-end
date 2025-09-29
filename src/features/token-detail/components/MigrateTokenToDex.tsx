import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
type DashLineProps = {
  count: number;
  width?: number;
  height?: number;
  spacing?: number;
  speed?: number;
};

const DashLine: React.FC<DashLineProps> = ({
  count,
  width = 375,
  height = 4,
  spacing = 16,
  speed = 2,
}) => {
  const rects = Array.from({ length: count }).map((_, index) => {
    const x = index * spacing;

    return (
      <rect
        key={index}
        x={x}
        y={-20}
        width={7.47513}
        height={52.3259}
        transform={`rotate(45 ${x} -20)`}
        fill="#D1D4DC"
      />
    );
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="dash-line-clip">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
      <rect width={width} height={height} fill="#E6E8EC" />
      <motion.g
        clipPath="url(#dash-line-clip)"
        animate={{ x: [-spacing, 0] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        }}
      >
        {rects}
      </motion.g>
    </svg>
  );
};

const MigrateTokenToDex = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-[80px] left-0 right-0 bg-white">
      <DashLine count={50} width={550} speed={1} />
      <div className="py-4 text-center text-sm text-[#777E90]">
        {t("tokenDetail.migrateToRaydiumInProgress")} <br />
        {t("tokenDetail.tradingTemporarilyPaused")}
      </div>
    </div>
  );
};

export default MigrateTokenToDex;
