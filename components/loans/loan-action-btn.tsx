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
import {
  CircleCheckBig,
  CircleX,
  RotateCcw,
  Settings2,
  SquarePen,
  Trash,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Book, Loan, Member } from "@/generated/prisma/client";
import { isEqual } from "lodash";
import {
  deleteLoan,
  renewLoan,
  returnLoan,
  updateLoan,
} from "@/app/actions/loan";
import { DatePicker } from "../others/date-picker";
import { useTranslations } from "next-intl";

type LoanData = Pick<Loan, "id" | "end_date" | "is_returned"> &
  Pick<Member, "email"> &
  Pick<Book, "bar_code">;

export const LoanActionButton = ({
  prevLoanData,
}: {
  prevLoanData: LoanData;
}) => {
  const t = useTranslations("Loans");
  const tActions = useTranslations("Actions");
  const tLoanActions = useTranslations("Loans.actions");

  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [deleteLoanState, deleteLoanAction, deleteLoanIsPending] =
    useActionState(deleteLoan, { timestamp: 0, success: false });
  const [returnLoanState, returnLoanAction, returnLoanIsPending] =
    useActionState(returnLoan, { timestamp: 0, success: false });
  const [renewLoanState, renewLoanAction, renewLoanIsPending] = useActionState(
    renewLoan,
    { timestamp: 0, success: false },
  );
  const [updateLoanState, updateLoanAction, updateLoanIsPending] =
    useActionState(updateLoan, {
      timestamp: 0,
      success: false,
      not_found: "",
    });

  const [loanData, setLoanData] = useState<LoanData>(prevLoanData);

  useEffect(() => {
    if (deleteLoanState.success) {
      router.refresh();
      toast.success(t("delete.success"), { position: "top-center" });
      setShowDeleteDialog(false);
    } else if (!deleteLoanState.success && deleteLoanState.timestamp) {
      toast.error(t("delete.error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoanState.timestamp]);

  useEffect(() => {
    if (updateLoanState.success) {
      router.refresh();
      toast.success(t("edit.success"), { position: "top-center" });
      setShowEditDialog(false);
    } else if (!updateLoanState.success && updateLoanState.timestamp) {
      toast.error(t("edit.error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLoanState.timestamp]);

  useEffect(() => {
    if (returnLoanState.success) {
      router.refresh();
      toast.success(t("returnAction.success"), {
        position: "top-center",
      });
      setLoanData((prev) => ({ ...prev, is_returned: !prev.is_returned }));
    } else if (!returnLoanState.success && returnLoanState.timestamp) {
      toast.error(t("returnAction.error"), {
        position: "top-center",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnLoanState.timestamp]);

  useEffect(() => {
    if (renewLoanState.success) {
      router.refresh();
      toast.success(t("renew.success"), { position: "top-center" });
    } else if (!renewLoanState.success && renewLoanState.timestamp) {
      toast.error(t("renew.error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renewLoanState.timestamp]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"}>
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{tActions("action")}</DropdownMenuLabel>
          <form action={renewLoanAction}>
            <input readOnly type="hidden" name="id" value={loanData.id} />
            <DropdownMenuItem asChild>
              <button
                disabled={renewLoanIsPending}
                type="submit"
                className="flex w-full items-center gap-1"
              >
                <RotateCcw />
                {tLoanActions("renew")}
              </button>
            </DropdownMenuItem>
          </form>
          <form action={returnLoanAction}>
            <input readOnly type="hidden" name="id" value={loanData.id} />
            <DropdownMenuItem asChild>
              <button
                disabled={returnLoanIsPending}
                type="submit"
                className="flex w-full items-center gap-1"
              >
                {loanData.is_returned ? (
                  <>
                    <CircleX />
                    {tLoanActions("unreturn")}
                  </>
                ) : (
                  <>
                    <CircleCheckBig />
                    {tLoanActions("return")}
                  </>
                )}
              </button>
            </DropdownMenuItem>
          </form>
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
                  <FieldDescription>{t("edit.description")}</FieldDescription>
                  <form action={updateLoanAction}>
                    <input
                      readOnly
                      type="hidden"
                      name="id"
                      value={prevLoanData.id}
                    />
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="bar_code">
                          {t("create.bookBarCode")}
                        </FieldLabel>
                        <Input
                          id="bar_code"
                          name="bar_code"
                          autoComplete="off"
                          placeholder={t("create.bookBarCode")}
                          aria-invalid={updateLoanState.not_found === "book"}
                          value={loanData.bar_code}
                          onChange={(e) =>
                            setLoanData((prev) => ({
                              ...prev,
                              bar_code: e.target.value,
                            }))
                          }
                        />
                        {updateLoanState.not_found === "book" && (
                          <FieldError>{t("create.bookNotFound")}</FieldError>
                        )}
                        <FieldLabel htmlFor="email">
                          {t("create.memberEmail")}
                        </FieldLabel>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="off"
                          aria-invalid={updateLoanState.not_found === "member"}
                          placeholder={t("create.memberEmail")}
                          value={loanData.email}
                          onChange={(e) =>
                            setLoanData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                        {updateLoanState.not_found === "member" && (
                          <FieldError>{t("create.memberNotFound")}</FieldError>
                        )}
                        <FieldLabel htmlFor="author">
                          {t("create.endDate")}
                        </FieldLabel>
                        <DatePicker
                          date={loanData.end_date}
                          onDateChange={(date) => {
                            if (!date) return;
                            setLoanData((prev) => ({
                              ...prev,
                              end_date: date as Date,
                            }));
                          }}
                        />
                        <input
                          readOnly
                          type="hidden"
                          name="end_date"
                          value={loanData.end_date.toISOString()}
                        />
                      </Field>
                      <Field className="flex flex-row gap-2">
                        <Button
                          type="submit"
                          disabled={
                            updateLoanIsPending ||
                            !loanData.bar_code.length ||
                            !loanData.email.length ||
                            !loanData.end_date ||
                            isEqual(prevLoanData, loanData)
                          }
                          className="flex-1"
                        >
                          {tActions("update")}
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
                  <form action={deleteLoanAction} className="flex-1">
                    <Button
                      className="w-full"
                      type="submit"
                      variant={"destructive"}
                      disabled={deleteLoanIsPending}
                    >
                      {tActions("permanentlyDelete")}
                    </Button>
                    <input
                      readOnly
                      type="hidden"
                      name="id"
                      defaultValue={prevLoanData.id}
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
