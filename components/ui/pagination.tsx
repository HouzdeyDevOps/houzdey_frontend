interface PaginationProps {
  currentPage: number | undefined;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Page numbers to show: first, last, and a window around the current page, with null as an ellipsis gap.
function getPageItems(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | null)[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push(null);
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push(null);
  items.push(total);
  return items;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const current = currentPage ?? 1;
  const items = getPageItems(current, totalPages);
  const base = 'min-w-10 px-3 py-2 rounded-lg text-sm';
  const idle = 'bg-gray-100 text-gray-600 hover:bg-gray-200';

  return (
    <nav aria-label="Pagination" className="flex flex-wrap justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current <= 1}
        className={`${base} ${idle} disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Previous page"
      >
        Prev
      </button>

      {items.map((page, i) =>
        page === null ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400" aria-hidden="true">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={current === page ? 'page' : undefined}
            className={`${base} ${current === page ? 'bg-indigo-600 text-white' : idle}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current >= totalPages}
        className={`${base} ${idle} disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
