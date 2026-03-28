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

export const MemberCreateButton = () => {
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
      toast.success("Member created successfully.", { position: "top-center" });
      setShowCreateDialog(false);
      setInputMemberData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      });
    } else if (!createMemberState.success && createMemberState.timestamp) {
      toast.success("Failed to create member.", { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createMemberState.timestamp]);

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger>
        <Button variant={"outline"}>
          <Plus /> Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle hidden />
          <DialogDescription hidden />
          <FieldSet>
            <FieldLegend>Create Member</FieldLegend>
            <FieldDescription>
              You must enter an unique email that has not been chosen.
            </FieldDescription>
            <form action={createMemberAction}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                  <Input
                    id="first_name"
                    name="first_name"
                    autoComplete="off"
                    placeholder="First Name"
                    value={inputMemberData.first_name}
                    onChange={(e) =>
                      setInputMemberData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                  <Input
                    id="last_name"
                    name="last_name"
                    autoComplete="off"
                    placeholder="Last Name"
                    value={inputMemberData.last_name}
                    onChange={(e) =>
                      setInputMemberData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="email">Email</FieldLabel>
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
                      This email is already taken. Please chose another one.
                    </FieldError>
                  )}
                  <FieldLabel htmlFor="phone_number">Phone</FieldLabel>
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
