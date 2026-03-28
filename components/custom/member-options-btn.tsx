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

export const MemberOptionsButton = ({
  prevMemberData,
}: {
  prevMemberData: Member;
}) => {
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
      toast.success("Member deleted permanently.", { position: "top-center" });
      setShowDeleteDialog(false);
    } else if (!deleteMemberState.success && deleteMemberState.timestamp) {
      toast.error("Could not delete the member.", { position: "top-center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteMemberState.timestamp]);

  useEffect(() => {
    if (updateMemberState.success) {
      router.refresh();
      toast.success("Member updated successfully.", { position: "top-center" });
      setShowEditDialog(false);
    } else if (!updateMemberState.success && updateMemberState.timestamp) {
      toast.error("Could not update the member.", { position: "top-center" });
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
                  <FieldLegend>Edit Member</FieldLegend>
                  <FieldDescription>
                    You must enter an email that has not been chosen
                  </FieldDescription>
                  <form action={updateMemberAction}>
                    <input
                      type="text"
                      name="id"
                      hidden
                      defaultValue={prevMemberData.id}
                    />
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                        <Input
                          id="first_name"
                          name="first_name"
                          autoComplete="off"
                          placeholder="First Name"
                          value={memberData.first_name}
                          onChange={(e) =>
                            setMemberData((prev) => ({
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
                          value={memberData.last_name}
                          onChange={(e) =>
                            setMemberData((prev) => ({
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
                            This email is already taken. Please chose another
                            one.
                          </FieldError>
                        )}
                        <FieldLabel htmlFor="phone_number">Phone</FieldLabel>
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
                  account and remove its data from our servers.
                </DialogDescription>
                <div className="flex gap-2 w-full">
                  <form action={deleteMemberAction} className="flex-1">
                    <Button
                      className="w-full"
                      type="submit"
                      variant={"destructive"}
                      disabled={deleteMemberIsPending}
                    >
                      Permanently Delete
                    </Button>
                    <input
                      type="text"
                      name="id"
                      defaultValue={prevMemberData.id}
                      hidden
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
