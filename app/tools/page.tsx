import { redirect } from "next/navigation";

// Redirect /tools to /picks for route consistency
export default function ToolsPage() {
  redirect("/picks");
}
