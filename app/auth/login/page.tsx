import { loginUserAction } from "@/app/actions/auth-actions";
import { LoginForm } from "@/components/ui/8bit/blocks/login-form";
import { redirect } from "next/navigation";

function decode(v?: string | string[] | null) {
  if (!v) return undefined;
  const s = Array.isArray(v) ? v[0] : v;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <LoginForm />;
}
