interface UiAlertBoxOptions {
  type?: string;
  closeOnMask?: boolean;
  okButton?: string;
  okButtonColor?: string;
  okButtonAction?: Function | undefined;
  cancelButton?: string;
  cancelButtonColor?: string;
  cancelButtonAction?: Function | undefined;
  showCancelButton?: boolean;
  message: string;
  title?: string;
}
