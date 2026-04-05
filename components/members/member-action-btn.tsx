"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "../ui/button";
import { Settings2, SquarePen, Trash } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { deleteMember, updateMember } from "@/app/actions/member";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Member } from "@/generated/prisma/client";
import { isEqual } from "lodash";
import { useTranslations } from "next-intl";

export const MemberActionButton = ({
  prevMemberData,
}: {
  prevMemberData: Member;
}) => {
  const t = useTranslations("Members");
  const tActions = useTranslations("Actions");
  const tTable = useTranslations("Members.table");

  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [deleteMemberState, deleteMemberAction, deleteMemberIsPending] =
    useActionState(deleteMember, { timestamp: 0, success: false });
  const [updateMemberState, updateMemberAction, updateMemberIsPending] =
    useActionState(updateMember, {
      timestamp: 0,
      success: false,
      emailTaken: false,
    });

  const [memberData, setMemberData] = useState<Member>(prevMemberData);

  useEffect(() => {
    if (deleteMemberState.success) {
      router.refresh();
      toast.success(t("delete.success"), { position: "top-center" });
      setShowDeleteDialog(false);
    } else if (!deleteMemberState.success && deleteMemberState.timestamp) {
      toast.error(t("delete.error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteMemberState.timestamp]);

  useEffect(() => {
    if (updateMemberState.success) {
      router.refresh();
      toast.success(t("edit.success"), { position: "top-center" });
      setShowEditDialog(false);
    } else if (!updateMemberState.success && updateMemberState.timestamp) {
      toast.error(t("edit.error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMemberState.timestamp]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"}>
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{tActions("action")}</DropdownMenuLabel>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setShowEditDialog(true);
                }}
              >
                <SquarePen />
                {tActions("edit")}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle hidden />
                <DialogDescription hidden />
                <FieldSet>
                  <FieldLegend>{t("edit.title")}</FieldLegend>
                  <FieldDescription>
                    {t("create.description")}
                  </FieldDescription>
                  <form action={updateMemberAction}>
                    <input
                      readOnly
                      type="hidden"
                      name="id"
                      value={prevMemberData.id}
                    />
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="first_name">{tTable("firstName")}</FieldLabel>
                        <Input
                          id="first_name"
                          name="first_name"
                          autoComplete="off"
                          placeholder={tTable("firstName")}
                          value={memberData.first_name}
                          onChange={(e) =>
                            setMemberData((prev) => ({
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
                          value={memberData.last_name}
                          onChange={(e) =>
                            setMemberData((prev) => ({
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
                          aria-invalid={updateMemberState.emailTaken}
                          placeholder="example@email.com"
                          value={memberData.email}
                          onChange={(e) =>
                            setMemberData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                        {updateMemberState.emailTaken && (
                          <FieldError>
                            {t("create.emailTaken")}
                          </FieldError>
                        )}
                        <FieldLabel htmlFor="phone_number">{tTable("phoneNumber")}</FieldLabel>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          autoComplete="off"
                          placeholder="+1 (234) 567-8910"
                          value={memberData.phone_number ?? undefined}
                          onChange={(e) =>
                            setMemberData((prev) => ({
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
                            updateMemberIsPending ||
                            isEqual(prevMemberData, memberData)
                          }
                          className="flex-1"
                        >
                          {tActions("apply")}
                        </Button>
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={() => setShowEditDialog(false)}
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
          <DropdownMenuSeparator />
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-500 flex gap-1 items-center"
                onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash />
                {tActions("delete")}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{tActions("areYouSure")}</DialogTitle>
                <DialogDescription>
                  {tActions("cannotBeUndone")}
                </DialogDescription>
                <div className="flex gap-2 w-full">
                  <form action={deleteMemberAction} className="flex-1">
                    <Button
                      className="w-full"
                      type="submit"
                      variant={"destructive"}
                      disabled={deleteMemberIsPending}
                    >
                      {tActions("permanentlyDelete")}
                    </Button>
                    <input
                      readOnly
                      type="hidden"
                      name="id"
                      value={prevMemberData.id}
                    />
                  </form>
                  <Button
                    onClick={() => setShowDeleteDialog(false)}
                    className="flex-1"
                    variant={"secondary"}
                  >
                    {tActions("cancel")}
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
