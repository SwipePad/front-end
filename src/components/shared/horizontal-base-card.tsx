type HorizontalBaseCardProps = {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  centerSection: React.ReactNode;
};

export const HorizontalBaseCard = ({
  leftSection,
  rightSection,
  centerSection,
}: HorizontalBaseCardProps) => {
  return (
    <div className="flex items-center gap-2">
      {leftSection && <div>{leftSection}</div>}
      <div className="flex-1">{centerSection}</div>
      {rightSection && <div>{rightSection}</div>}
    </div>
  );
};
