import { TableCell } from "@/components/ui/table";

// TruncatedCell component for limiting text display

interface TruncatedCellProps {
  children: React.ReactNode;
  maxLength: number;
  className?: string;
}

export const TruncatedCell = ({
  children,
  maxLength = 20,
  className = "",
}: TruncatedCellProps) => {
  const text = children?.toString() || "";
  const shouldTruncate = text.length > maxLength;
  const truncatedText = shouldTruncate
    ? `${text.slice(0, maxLength)}...`
    : text;

  return (
    <TableCell className={className}>
      {shouldTruncate ? <span title={text}>{truncatedText}</span> : children}
    </TableCell>
  );
};
