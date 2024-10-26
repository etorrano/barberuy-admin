import { Pencil, Trash2 } from "lucide-react";

export function DataTableActions(props: { onEdit: any; onDelete: any }) {
  return (
    <div className="table-actions flex items-center gap-4">
      <Pencil onClick={props.onEdit} />
      <Trash2 onClick={props.onDelete} />
    </div>
  );
}
