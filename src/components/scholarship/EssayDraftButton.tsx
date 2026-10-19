"use client";

interface EssayDraftButtonProps {
  scholarshipId: string;
}

export function EssayDraftButton({ scholarshipId }: EssayDraftButtonProps) {
  const handleDraft = async () => {
    try {
      const res = await fetch("/api/essay/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId,
          promptType: "personal_statement",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Store essay in sessionStorage for retrieval
        if (typeof window !== "undefined" && data.essay) {
          sessionStorage.setItem(`essay_draft_${scholarshipId}`, data.essay);
          window.alert("Essay draft generated! It will open in a new window.");
          window.open(`/dashboard?essay_draft=${scholarshipId}`, "_blank");
        } else {
          window.alert("Essay generated! Check your dashboard.");
        }
      } else {
        const err = await res.json();
        window.alert(`Failed to generate essay: ${err.error || "Please try again."}`);
      }
    } catch {
      window.alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleDraft}
      className="flex items-center gap-2 w-full text-sm text-slate-700 hover:text-indigo-600 py-1.5 transition"
    >
      <span>✍️</span> Draft My Essay
    </button>
  );
}
