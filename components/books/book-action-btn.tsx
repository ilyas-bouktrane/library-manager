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
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Book } from "@/generated/prisma/client";
import { isEqual } from "lodash";
import { deleteBook, updateBook } from "@/app/actions/book";
import { useTranslations } from "next-intl";

export const BookActionButton = ({ prevBookData }: { prevBookData: Book }) => {
  const t = useTranslations("Books");
  const tActions = useTranslations("Actions");
  const tTable = useTranslations("Books.table");

  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [deleteBookState, deleteBookAction, deleteBookIsPending] =
    useActionState(deleteBook, { timestamp: 0, success: false });
  const [updateBookState, updateBookAction, updateBookIsPending] =
    useActionState(updateBook, {
      timestamp: 0,
      success: false,
      barCodeTaken: false,
    });

  const [bookData, setBookData] = useState<Book>(prevBookData);

  useEffect(() => {
    if (deleteBookState.success) {
      router.refresh();
      toast.success(t("delete.success"), { position: "top-center" });
      setShowDeleteDialog(false);
    } else if (!deleteBookState.success && deleteBookState.timestamp) {
      toast.error(t("delete.error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteBookState.timestamp]);

  useEffect(() => {
    if (updateBookState.success) {
      router.refresh();
      toast.success(t("edit.success"), { position: "top-center" });
      setShowEditDialog(false);
    } else if (!updateBookState.success && updateBookState.timestamp) {
      toast.error(t("edit.error"), { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBookState.timestamp]);

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
                    {t("edit.description")}
                  </FieldDescription>
                  <form action={updateBookAction}>
                    <input
                      readOnly
                      type="hidden"
                      name="id"
                      value={prevBookData.id}
                    />
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="bar_code">{tTable("barCode")}</FieldLabel>
                        <Input
                          id="bar_code"
                          type="bar_code"
                          name="bar_code"
                          autoComplete="off"
                          aria-invalid={updateBookState.barCodeTaken}
                          placeholder={tTable("barCode")}
                          value={bookData.bar_code}
                          onChange={(e) =>
                            setBookData((prev) => ({
                              ...prev,
                              bar_code: e.target.value,
                            }))
                          }
                        />
                        {updateBookState.barCodeTaken && (
                          <FieldError>
                            {t("create.barCodeTaken")}
                          </FieldError>
                        )}
                        <FieldLabel htmlFor="title">{tTable("title")}</FieldLabel>
                        <Input
                          id="title"
                          name="title"
                          autoComplete="off"
                          placeholder={tTable("title")}
                          value={bookData.title}
                          onChange={(e) =>
                            setBookData((prev) => ({
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
                          value={bookData.author ?? undefined}
                          onChange={(e) =>
                            setBookData((prev) => ({
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
                          value={bookData.quantity || undefined}
                          onChange={(e) =>
                            setBookData((prev) => ({
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
                            updateBookIsPending ||
                            isEqual(prevBookData, bookData)
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
                  <form action={deleteBookAction} className="flex-1">
                    <Button
                      className="w-full"
                      type="submit"
                      variant={"destructive"}
                      disabled={deleteBookIsPending}
                    >
                      {tActions("permanentlyDelete")}
                    </Button>
                    <input
                      readOnly
                      type="hidden"
                      name="id"
                      defaultValue={prevBookData.id}
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
