import { Sheet } from "react-modal-sheet";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  disableCloseDrag?: boolean;
};
export const BottomDraw = (props: Props) => {
  return (
    <>
      <Sheet
        detent="content-height"
        isOpen={props.isOpen}
        onClose={() => props.onClose()}
        disableScrollLocking={true}
      >
        <Sheet.Container className="!rounded-t-[32px]">
          <Sheet.Header disableDrag={props.disableCloseDrag || false} />
          <Sheet.Content disableDrag={props.disableCloseDrag || false}>
            <div className="mb-[34px]">
              <div className="flex items-center justify-between px-2">
                <div className="flex-1">{props.leftSection}</div>
                <p className="text-center text-[16px] font-semibold not-italic leading-[24px] tracking-[-0.64px]">
                  {props.title ?? ""}
                </p>
                <div className="flex-1">{props.rightSection}</div>
              </div>
              {props.children}
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => props.onClose()} />
      </Sheet>
    </>
  );
};
