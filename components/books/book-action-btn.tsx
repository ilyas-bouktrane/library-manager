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

export const BookActionButton = ({ prevBookData }: { prevBookData: Book }) => {
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
      toast.success("Book deleted permanently.", { position: "top-center" });
      setShowDeleteDialog(false);
    } else if (!deleteBookState.success && deleteBookState.timestamp) {
      toast.error("Could not delete the book.", { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteBookState.timestamp]);

  useEffect(() => {
    if (updateBookState.success) {
      router.refresh();
      toast.success("Book updated successfully.", { position: "top-center" });
      setShowEditDialog(false);
    } else if (!updateBookState.success && updateBookState.timestamp) {
      toast.error("Could not update the book.", { position: "top-center" });
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
          <DropdownMenuLabel>Action</DropdownMenuLabel>
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
                  <FieldLegend>Edit Book</FieldLegend>
                  <FieldDescription>
                    The bar code must be unique.
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
                        <FieldLabel htmlFor="bar_code">Bar Code</FieldLabel>
                        <Input
                          id="bar_code"
                          type="bar_code"
                          name="bar_code"
                          autoComplete="off"
                          aria-invalid={updateBookState.barCodeTaken}
                          placeholder="Bar Code"
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
                            This bar code is already taken.
                          </FieldError>
                        )}
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                          id="title"
                          name="title"
                          autoComplete="off"
                          placeholder="Title"
                          value={bookData.title}
                          onChange={(e) =>
                            setBookData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                        <FieldLabel htmlFor="author">Author</FieldLabel>
                        <Input
                          id="author"
                          name="author"
                          autoComplete="off"
                          placeholder="Author"
                          value={bookData.author ?? undefined}
                          onChange={(e) =>
                            setBookData((prev) => ({
                              ...prev,
                              author: e.target.value,
                            }))
                          }
                        />
                        <FieldLabel htmlFor="phone_number">Quantity</FieldLabel>
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
                          Apply
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
                  book and remove its data from our servers.
                </DialogDescription>
                <div className="flex gap-2 w-full">
                  <form action={deleteBookAction} className="flex-1">
                    <Button
                      className="w-full"
                      type="submit"
                      variant={"destructive"}
                      disabled={deleteBookIsPending}
                    >
                      Permanently Delete
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
