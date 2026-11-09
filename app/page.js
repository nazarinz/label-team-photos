import { redirect } from "next/navigation";
import { isAuthed } from "../lib/auth";
import Gallery from "../components/Gallery";

export const dynamic = "force-dynamic";

export default function Home() {
  if (!isAuthed()) redirect("/login");
  return <Gallery />;
}
