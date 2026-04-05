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

type LoanData = Pick<Loan, "id" | "end_date" | "is_returned"> &
  Pick<Member, "email"> &
  Pick<Book, "bar_code">;

export const LoanActionButton = ({
  prevLoanData,
}: {
  prevLoanData: LoanData;
}) => {
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
      toast.success("Loan deleted permanently.", { position: "top-center" });
      setShowDeleteDialog(false);
    } else if (!deleteLoanState.success && deleteLoanState.timestamp) {
      toast.error("Could not delete the loan.", { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoanState.timestamp]);

  useEffect(() => {
    if (updateLoanState.success) {
      router.refresh();
      toast.success("Loan updated successfully.", { position: "top-center" });
      setShowEditDialog(false);
    } else if (!updateLoanState.success && updateLoanState.timestamp) {
      toast.error("Could not update the loan.", { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLoanState.timestamp]);

  useEffect(() => {
    if (returnLoanState.success) {
      router.refresh();
      toast.success("Loan return state changed successfully.", {
        position: "top-center",
      });
      setLoanData((prev) => ({ ...prev, is_returned: !prev.is_returned }));
    } else if (!returnLoanState.success && returnLoanState.timestamp) {
      toast.error("Could not change the return state of the loan.", {
        position: "top-center",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnLoanState.timestamp]);

  useEffect(() => {
    if (renewLoanState.success) {
      router.refresh();
      toast.success("Loan renewed successfully.", { position: "top-center" });
    } else if (!renewLoanState.success && renewLoanState.timestamp) {
      toast.error("Could not renew the loan.", { position: "top-center" });
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
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <form action={renewLoanAction}>
            <input readOnly type="hidden" name="id" value={loanData.id} />
            <DropdownMenuItem asChild>
              <button
                disabled={renewLoanIsPending}
                type="submit"
                className="flex w-full items-center gap-1"
              >
                <RotateCcw />
                Renew
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
                    Unreturn
                  </>
                ) : (
                  <>
                    <CircleCheckBig />
                    Return
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
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle hidden />
                <DialogDescription hidden />
                <FieldSet>
                  <FieldLegend>Edit Loan</FieldLegend>
                  <FieldDescription>
                    Here you can correct mistakes on loans.
                  </FieldDescription>
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
                          Book&apos;s Bar Code
                        </FieldLabel>
                        <Input
                          id="bar_code"
                          name="bar_code"
                          autoComplete="off"
                          placeholder="Bar code"
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
                          <FieldError>This book does not exist.</FieldError>
                        )}
                        <FieldLabel htmlFor="email">
                          Member&apos;s Email
                        </FieldLabel>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="off"
                          aria-invalid={updateLoanState.not_found === "member"}
                          placeholder="Email"
                          value={loanData.email}
                          onChange={(e) =>
                            setLoanData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                        {updateLoanState.not_found === "member" && (
                          <FieldError>This email does not exist.</FieldError>
                        )}
                        <FieldLabel htmlFor="author">Loan End Date</FieldLabel>
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
                          Update
                        </Button>
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={() => setShowEditDialog(false)}
                          variant={"secondary"}
                        >
                          Cancel
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
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  loan and remove its data from our servers.
                </DialogDescription>
                <div className="flex gap-2 w-full">
                  <form action={deleteLoanAction} className="flex-1">
                    <Button
                      className="w-full"
                      type="submit"
                      variant={"destructive"}
                      disabled={deleteLoanIsPending}
                    >
                      Permanently Delete
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
                    Cancel
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
