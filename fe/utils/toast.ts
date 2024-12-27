export type ToastFunction = (props: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}) => void;

class ToastUtil {
  private static instance: ToastUtil;
  private toast: ToastFunction | null = null;

  static getInstance() {
    if (!ToastUtil.instance) {
      ToastUtil.instance = new ToastUtil();
    }
    return ToastUtil.instance;
  }

  setToast(toast: ToastFunction) {
    this.toast = toast;
  }

  show(
    title: string,
    description?: string,
    variant?: "default" | "destructive",
    action?: React.ReactNode
  ) {
    if (this.toast) {
      this.toast({ title, description, variant, action });
    }
  }
}

export const toastUtil = ToastUtil.getInstance();
