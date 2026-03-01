import { useState, useMemo } from "react";

export const useWorkspacePagination = <T>(items: T[], pageSize: number = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    pageSize,
    total: items.length,
    paginatedItems,
    setCurrentPage,
    resetPage,
  };
};
