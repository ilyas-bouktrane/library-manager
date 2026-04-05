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

export const BookCreateButton = () => {
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
      toast.success("Book created successfully.", { position: "top-center" });
      setShowCreateDialog(false);
      setInputBookData({
        bar_code: "",
        title: "",
        author: "",
        quantity: 0,
      });
    } else if (!createBookState.success && createBookState.timestamp) {
      toast.error("Failed to create book.", { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBookState.timestamp]);

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger>
        <Button variant={"outline"}>
          <Plus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle hidden />
          <DialogDescription hidden />
          <FieldSet>
            <FieldLegend>Create Book</FieldLegend>
            <FieldDescription>
              You must enter an unique bar code that has not been chosen.
            </FieldDescription>
            <form action={createBookAction}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="bar_code">Bar Code</FieldLabel>
                  <Input
                    id="bar_code"
                    type="bar_code"
                    name="bar_code"
                    autoComplete="off"
                    aria-invalid={createBookState.barCodeTaken}
                    placeholder="Bar Code"
                    value={inputBookData.bar_code}
                    onChange={(e) =>
                      setInputBookData((prev) => ({
                        ...prev,
                        bar_code: e.target.value,
                      }))
                    }
                  />
                  {createBookState.barCodeTaken && (
                    <FieldError>This bar code is already taken.</FieldError>
                  )}
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    autoComplete="off"
                    placeholder="Title"
                    value={inputBookData.title}
                    onChange={(e) =>
                      setInputBookData((prev) => ({
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
                    value={inputBookData.author ?? undefined}
                    onChange={(e) =>
                      setInputBookData((prev) => ({
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
                    Create
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => setShowCreateDialog(false)}
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
  );
};
