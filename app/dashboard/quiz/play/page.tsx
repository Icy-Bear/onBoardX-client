import { PlayScreen } from "@/components/quiz/play-screen";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PlayQuizPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="p-6">
            <PlayScreen userName={session.user.name} userId={session.user.id} />
        </div>
    );
}
