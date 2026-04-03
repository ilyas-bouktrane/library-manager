"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { updateSetting } from "@/app/actions/setting";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export const SettingField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const router = useRouter();
  const [prevValue, setPrevValue] = useState(value);
  const [newValue, setNewValue] = useState(value);
  const [updateSettingState, updateSettingAction, updateSettingIsPending] =
    useActionState(updateSetting, {
      success: false,
      timestamp: 0,
    });

  useEffect(() => {
    if (updateSettingState.success) {
      router.refresh();
      toast.success("Setting updated successfully.", {
        position: "top-center",
      });
      setPrevValue(newValue);
    } else if (!updateSettingState.success && updateSettingState.timestamp) {
      toast.error("Setting failed to update.", { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSettingState.timestamp]);

  return (
    <form
      action={updateSettingAction}
      className="flex gap-3 items-center w-full"
    >
      <Label>{label}</Label>
      <input readOnly type="hidden" name="key" value={label} />
      <Input
        name="value"
        placeholder={value}
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        disabled={updateSettingIsPending}
      />
      <Button
        disabled={updateSettingIsPending || newValue === prevValue}
        type="submit"
      >
        Apply
      </Button>
    </form>
  );
};
