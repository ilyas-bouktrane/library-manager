import { SettingField } from "@/components/settings/setting-field";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getSettings } from "@/lib/settings";

export default async function Settings() {
  const settings = await getSettings();

  return (
    <main className="py-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage the app&apos;s default settings here.
          </CardDescription>
        </CardHeader>
        <CardFooter className="grid grid-cols-[1fr_5fr] gap-y-4">
          {Object.entries(settings).flatMap(([key, value]) => [
            <Label key={`label-${key}`}>{key}</Label>,
            <SettingField key={`value-${key}`} label={key} value={value} />,
          ])}
        </CardFooter>
      </Card>
    </main>
  );
}
