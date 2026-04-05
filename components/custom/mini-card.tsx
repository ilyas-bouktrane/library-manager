import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { LucideProps } from "lucide-react";

export const MiniCard = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: React.ReactNode;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}) => (
  <Card className="flex-1">
    <CardHeader>
      <div className="flex gap-4 justify-between">
        <CardDescription>{label}</CardDescription>
        {Icon ? <Icon size={18} /> : null}
      </div>
      <CardTitle className="text-xl">{value}</CardTitle>
    </CardHeader>
  </Card>
);
