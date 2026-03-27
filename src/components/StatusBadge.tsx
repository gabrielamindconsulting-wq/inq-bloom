import { ScreeningStatus, STATUS_LABELS } from "@/data/mockData";

interface StatusBadgeProps {
  status: ScreeningStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<ScreeningStatus, string> = {
    nao_iniciada: "bg-status-pending-bg text-status-pending-text",
    em_andamento: "bg-status-progress-bg text-status-progress-text",
    concluida: "bg-status-done-bg text-status-done-text",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
