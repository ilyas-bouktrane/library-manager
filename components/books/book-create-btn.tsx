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
import { Book } from "@/generated/prisma/client";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { createBook } from "@/app/actions/book";
import { useTranslations } from "next-intl";

export const BookCreateButton = () => {
  const t = useTranslations("Books.create");
  const tActions = useTranslations("Actions");
  const tTable = useTranslations("Books.table");
  
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [inputBookData, setInputBookData] = useState<Omit<Book, "id">>({
    bar_code: "",
    title: "",
    author: "",
    quantity: 0,
  });
  const [createBookState, createBookAction, createBookIsPending] =
    useActionState(createBook, {
      timestamp: 0,
      success: false,
      barCodeTaken: false,
    });

  useEffect(() => {
    if (createBookState.success) {
      router.refresh();
      toast.success(t("success"), { position: "top-center" });
      setShowCreateDialog(false);
      setInputBookData({
        bar_code: "",
        title: "",
        author: "",
        quantity: 0,
      });
    } else if (!createBookState.success && createBookState.timestamp) {
      toast.error(t("error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBookState.timestamp]);

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
            <form action={createBookAction}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="bar_code">{tTable("barCode")}</FieldLabel>
                  <Input
                    id="bar_code"
                    type="bar_code"
                    name="bar_code"
                    autoComplete="off"
                    aria-invalid={createBookState.barCodeTaken}
                    placeholder={tTable("barCode")}
                    value={inputBookData.bar_code}
                    onChange={(e) =>
                      setInputBookData((prev) => ({
                        ...prev,
                        bar_code: e.target.value,
                      }))
                    }
                  />
                  {createBookState.barCodeTaken && (
                    <FieldError>{t("barCodeTaken")}</FieldError>
                  )}
                  <FieldLabel htmlFor="title">{tTable("title")}</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    autoComplete="off"
                    placeholder={tTable("title")}
                    value={inputBookData.title}
                    onChange={(e) =>
                      setInputBookData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="author">{tTable("author")}</FieldLabel>
                  <Input
                    id="author"
                    name="author"
                    autoComplete="off"
                    placeholder={tTable("author")}
                    value={inputBookData.author ?? undefined}
                    onChange={(e) =>
                      setInputBookData((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="phone_number">{tTable("quantity")}</FieldLabel>
                  <Input
                    type="number"
                    id="quantity"
                    name="quantity"
                    autoComplete="off"
                    placeholder="0"
                    value={inputBookData.quantity || undefined}
                    onChange={(e) =>
                      setInputBookData((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value) ?? undefined,
                      }))
                    }
                  />
                </Field>
                <Field className="flex flex-row gap-2">
                  <Button
                    type="submit"
                    disabled={
                      createBookIsPending ||
                      !inputBookData.bar_code.length ||
                      !inputBookData.title.length ||
                      !inputBookData.quantity
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
