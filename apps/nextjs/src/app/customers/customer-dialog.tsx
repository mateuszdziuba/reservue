import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

import { Button } from "~/components/ui/button";
import { DialogFooter, DialogHeader } from "~/components/ui/dialog";
import { CreateCustomerForm } from "./customer-form";

export function CustomerDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DialogTrigger>
        <Button onClick={() => setIsOpen(true)}>Dodaj klienta</Button>
      </DialogTrigger>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create item</DialogTitle>
            <DialogDescription>
              Add a new item to manage products and customers.
            </DialogDescription>
          </DialogHeader>
          <CreateCustomerForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
