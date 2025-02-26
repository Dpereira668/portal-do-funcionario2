
import { useState } from "react";

interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export const usePagination = ({ initialPage = 0, pageSize = 10 }: PaginationOptions = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const getRange = () => {
    const start = currentPage * pageSize;
    const end = start + pageSize - 1;
    return { start, end };
  };

  const nextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const reset = () => {
    setCurrentPage(0);
    setHasMore(true);
  };

  const updateHasMore = (dataLength: number) => {
    setHasMore(dataLength === pageSize);
  };

  return {
    currentPage,
    pageSize,
    hasMore,
    getRange,
    nextPage,
    previousPage,
    reset,
    updateHasMore,
  };
};
