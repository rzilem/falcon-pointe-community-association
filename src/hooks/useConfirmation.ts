
import { useState } from "react";

interface UseConfirmationReturn {
  isConfirmationOpen: boolean;
  itemToConfirm: string | null;
  confirmationTitle: string;
  confirmationDescription: string;
  confirmationVariant: "delete" | "warning" | "info";
  confirmationButtonLabel: string;
  cancelButtonLabel: string;
  openConfirmation: (params: OpenConfirmationParams) => void;
  closeConfirmation: () => void;
  handleConfirmAction: () => Promise<void>;
}

interface OpenConfirmationParams {
  itemId: string;
  title?: string;
  description?: string;
  variant?: "delete" | "warning" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (itemId: string) => Promise<void> | void;
}

export function useConfirmation(): UseConfirmationReturn {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [itemToConfirm, setItemToConfirm] = useState<string | null>(null);
  const [confirmationTitle, setConfirmationTitle] = useState("Confirm Action");
  const [confirmationDescription, setConfirmationDescription] = useState(
    "Are you sure you want to proceed with this action?"
  );
  const [confirmationVariant, setConfirmationVariant] = useState<"delete" | "warning" | "info">("warning");
  const [confirmationButtonLabel, setConfirmationButtonLabel] = useState("Confirm");
  const [cancelButtonLabel, setCancelButtonLabel] = useState("Cancel");
  const [onConfirmCallback, setOnConfirmCallback] = useState<(itemId: string) => Promise<void> | void>(
    () => Promise.resolve()
  );

  const openConfirmation = ({
    itemId,
    title = "Confirm Action",
    description = "Are you sure you want to proceed with this action?",
    variant = "warning",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
  }: OpenConfirmationParams) => {
    setItemToConfirm(itemId);
    setConfirmationTitle(title);
    setConfirmationDescription(description);
    setConfirmationVariant(variant);
    setConfirmationButtonLabel(confirmLabel);
    setCancelButtonLabel(cancelLabel);
    setOnConfirmCallback(() => onConfirm);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
    setItemToConfirm(null);
  };

  const handleConfirmAction = async () => {
    if (itemToConfirm) {
      await onConfirmCallback(itemToConfirm);
      closeConfirmation();
    }
  };

  return {
    isConfirmationOpen,
    itemToConfirm,
    confirmationTitle,
    confirmationDescription,
    confirmationVariant,
    confirmationButtonLabel,
    cancelButtonLabel,
    openConfirmation,
    closeConfirmation,
    handleConfirmAction,
  };
}
