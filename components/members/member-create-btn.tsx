"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useActionState, useEffect, useState } from "react";
import { createMember } from "@/app/actions/member";
import { Input } from "../ui/input";
import { Member } from "@/generated/prisma/client";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const MemberCreateButton = () => {
  const t = useTranslations("Members.create");
  const tActions = useTranslations("Actions");
  const tTable = useTranslations("Members.table");

  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [inputMemberData, setInputMemberData] = useState<
    Omit<Member, "created_at" | "id">
  >({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [createMemberState, createMemberAction, createMemberIsPending] =
    useActionState(createMember, {
      timestamp: 0,
      success: false,
      emailTaken: false,
    });

  useEffect(() => {
    if (createMemberState.success) {
      router.refresh();
      toast.success(t("success"), { position: "top-center" });
      setShowCreateDialog(false);
      setInputMemberData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      });
    } else if (!createMemberState.success && createMemberState.timestamp) {
      toast.error(t("error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createMemberState.timestamp]);

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger>
        <Button variant={"outline"}>
          <Plus /> {tActions("add")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle hidden />
          <DialogDescription hidden />
          <FieldSet>
            <FieldLegend>{t("title")}</FieldLegend>
            <FieldDescription>
              {t("description")}
            </FieldDescription>
            <form action={createMemberAction}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="first_name">{tTable("firstName")}</FieldLabel>
                  <Input
                    id="first_name"
                    name="first_name"
                    autoComplete="off"
                    placeholder={tTable("firstName")}
                    value={inputMemberData.first_name}
                    onChange={(e) =>
                      setInputMemberData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="last_name">{tTable("lastName")}</FieldLabel>
                  <Input
                    id="last_name"
                    name="last_name"
                    autoComplete="off"
                    placeholder={tTable("lastName")}
                    value={inputMemberData.last_name}
                    onChange={(e) =>
                      setInputMemberData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="email">{tTable("email")}</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="off"
                    aria-invalid={createMemberState.emailTaken}
                    placeholder="example@email.com"
                    value={inputMemberData.email}
                    onChange={(e) =>
                      setInputMemberData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  {createMemberState.emailTaken && (
                    <FieldError>
                      {t("emailTaken")}
                    </FieldError>
                  )}
                  <FieldLabel htmlFor="phone_number">{tTable("phoneNumber")}</FieldLabel>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    autoComplete="off"
                    placeholder="+1 (234) 567-8910"
                    value={inputMemberData.phone_number ?? undefined}
                    onChange={(e) =>
                      setInputMemberData((prev) => ({
                        ...prev,
                        phone_number: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field className="flex flex-row gap-2">
                  <Button
                    type="submit"
                    disabled={
                      createMemberIsPending ||
                      !inputMemberData.email.length ||
                      !inputMemberData.first_name.length ||
                      !inputMemberData.last_name.length
                    }
                    className="flex-1"
                  >
                    {tActions("create")}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => setShowCreateDialog(false)}
                    variant={"secondary"}
                  >
                    {tActions("cancel")}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </FieldSet>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
