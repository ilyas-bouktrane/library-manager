import { SettingField } from "@/components/custom/setting-field";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <CardFooter className="flex flex-col gap-4">
          {Object.entries(settings).map(([key, value]) => (
            <SettingField key={key} label={key} value={value} />
          ))}
        </CardFooter>
      </Card>
    </main>
  );
}
