import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import type { ReactNode, Ref } from "react";
import { forwardRef, useCallback } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export const CustomBottomSheetModal = forwardRef(
  function CustomBottomSheetModal(
    props: { children: ReactNode },
    ref: Ref<BottomSheetModal>,
  ) {
    const BackdropElement = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          opacity={0.7}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={BackdropElement}
      >
        <BottomSheetView>{props.children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);
