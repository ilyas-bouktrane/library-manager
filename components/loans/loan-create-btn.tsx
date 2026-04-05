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
import { Input } from "../ui/input";
import { Book, Loan, Member } from "@/generated/prisma/client";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { createLoan } from "@/app/actions/loan";
import { DatePicker } from "../others/date-picker";
import { useSettings } from "../settings/settings-context";
import { addDays } from "date-fns";
import { useTranslations } from "next-intl";

export const LoanCreateButton = () => {
  const t = useTranslations("Loans.create");
  const tActions = useTranslations("Actions");
  const tLoanActions = useTranslations("Loans.actions");

  const { LOAN_DURATION_DAYS } = useSettings();
  const INIT_END_DATE = addDays(new Date(), Number(LOAN_DURATION_DAYS));

  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [inputLoanData, setInputLoanData] = useState<
    Pick<Loan, "end_date"> & Pick<Member, "email"> & Pick<Book, "bar_code">
  >({
    email: "",
    bar_code: "",
    end_date: INIT_END_DATE,
  });
  const [createLoanState, createLoanAction, createLoanIsPending] =
    useActionState(createLoan, {
      timestamp: 0,
      success: false,
      not_found: "",
    });

  useEffect(() => {
    if (createLoanState.success) {
      router.refresh();
      toast.success(t("success"), { position: "top-center" });
      setShowDialog(false);
      setInputLoanData({
        email: "",
        bar_code: "",
        end_date: INIT_END_DATE,
      });
    } else if (!createLoanState.success && createLoanState.timestamp) {
      toast.error(t("error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoanState.timestamp]);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger>
        <Button variant={"outline"}>
          <Plus /> {tLoanActions("makeLoan")}
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
            <form action={createLoanAction}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="bar_code">
                    {t("bookBarCode")}
                  </FieldLabel>
                  <Input
                    id="bar_code"
                    name="bar_code"
                    autoComplete="off"
                    placeholder={t("bookBarCode")}
                    aria-invalid={createLoanState.not_found === "book"}
                    value={inputLoanData.bar_code}
                    onChange={(e) =>
                      setInputLoanData((prev) => ({
                        ...prev,
                        bar_code: e.target.value,
                      }))
                    }
                  />
                  {createLoanState.not_found === "book" && (
                    <FieldError>{t("bookNotFound")}</FieldError>
                  )}
                  <FieldLabel htmlFor="email">{t("memberEmail")}</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    aria-invalid={createLoanState.not_found === "member"}
                    placeholder={t("memberEmail")}
                    value={inputLoanData.email}
                    onChange={(e) =>
                      setInputLoanData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  {createLoanState.not_found === "member" && (
                    <FieldError>{t("memberNotFound")}</FieldError>
                  )}
                  <FieldLabel htmlFor="author">{t("endDate")}</FieldLabel>
                  <DatePicker
                    date={inputLoanData.end_date}
                    onDateChange={(date) =>
                      setInputLoanData((prev) => ({
                        ...prev,
                        end_date: (date as Date) || INIT_END_DATE,
                      }))
                    }
                  />
                  <input
                    readOnly
                    type="hidden"
                    name="end_date"
                    value={inputLoanData.end_date.toISOString()}
                  />
                </Field>
                <Field className="flex flex-row gap-2">
                  <Button
                    type="submit"
                    disabled={
                      createLoanIsPending ||
                      !inputLoanData.bar_code.length ||
                      !inputLoanData.email.length ||
                      !inputLoanData.end_date
                    }
                    className="flex-1"
                  >
                    {tActions("create")}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => setShowDialog(false)}
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
