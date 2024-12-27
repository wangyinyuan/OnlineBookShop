"use client";

import { useToast } from "@/hooks/use-toast";
import { ToastFunction, toastUtil } from "@/utils/toast";
import { useEffect } from "react";

export function ToastInitializer() {
  const { toast } = useToast();

  useEffect(() => {
    toastUtil.setToast(toast as ToastFunction);
  }, [toast]);

  return null;
}
