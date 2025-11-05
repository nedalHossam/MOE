import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from '@clayui/core';

/**
 * Enhanced Pagination component matching the Figma design.
 * Features modern styling with purple active states and proper arrow positioning.
 */
export default function Pagination({
  spritemap = '/public/icons.svg',
  className = '',
  activePage = 1,
  onPageChange,
  totalPages = 1,
  totalItems = 0,
  activeDelta = 10,
  deltas = [],
  onDeltaChange,
  showItemsPerPage = true,
  ...rest
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Calculate visible pages (show max 5 pages with ellipsis)
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return pages;
    }

    const current = activePage;
    const total = totalPages;

    if (current <= 3) {
      return [1, 2, 3, '...', total];
    } else if (current >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    } else {
      return [1, '...', current - 1, current, current + 1, '...', total];
    }
  };

  const visiblePages = getVisiblePages();

  const updatePageInUrl = (page) => {
    // Update URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', page);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
    // Use replaceState to avoid creating unnecessary history entries
    window.history.replaceState({}, '', newUrl);
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== activePage && onPageChange) {
      updatePageInUrl(page);
      onPageChange(page);
    }
  };

  const handleFirstPage = () => {
    if (activePage > 1 && onPageChange) {
      updatePageInUrl(1);
      onPageChange(1);
    }
  };

  const handlePrevPage = () => {
    if (activePage > 1 && onPageChange) {
      const newPage = activePage - 1;
      updatePageInUrl(newPage);
      onPageChange(newPage);
    }
  };

  const handleNextPage = () => {
    if (activePage < totalPages && onPageChange) {
      const newPage = activePage + 1;
      updatePageInUrl(newPage);
      onPageChange(newPage);
    }
  };

  const handleLastPage = () => {
    if (activePage < totalPages && onPageChange) {
      updatePageInUrl(totalPages);
      onPageChange(totalPages);
    }
  };

  const handleDeltaChange = (newDelta) => {
    // Update URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('pageSize', newDelta);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
    // Use replaceState to avoid creating unnecessary history entries
    window.history.replaceState({}, '', newUrl);

    // Call the original callback if provided
    if (onDeltaChange) {
      onDeltaChange(newDelta);
    }
  };

  return (
    <Provider spritemap={spritemap}>
      <div className={`pagination-wrapper-enhanced ${className}`}>
        {/* Items per page selector */}
        {showItemsPerPage && deltas.length > 0 && onDeltaChange && (
          <div className="items-per-page">
            <span>Items per page:</span>
            <select
              value={activeDelta}
              onChange={(e) => handleDeltaChange(parseInt(e.target.value))}
            >
              {deltas.map(delta => (
                <option key={delta.label} value={delta.label}>
                  {delta.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination controls - matching Figma design */}
        <div className="pagination-controls-enhanced">
          {/* First page button (<<) */}
          <button
            className="pagination-nav-button pagination-first"
            onClick={handleFirstPage}
            disabled={activePage === 1}
            title="First page"
          >
            ≪
          </button>

          {/* Previous page button (<) */}
          <button
            className="pagination-nav-button pagination-prev"
            onClick={handlePrevPage}
            disabled={activePage === 1}
            title="Previous page"
          >
            ‹
          </button>

          {/* Page numbers */}
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  className={`pagination-page-button ${page === activePage ? 'active' : ''}`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next page button (>) */}
          <button
            className="pagination-nav-button pagination-next"
            onClick={handleNextPage}
            disabled={activePage === totalPages}
            title="Next page"
          >
            ›
          </button>

          {/* Last page button (>>) */}
          <button
            className="pagination-nav-button pagination-last"
            onClick={handleLastPage}
            disabled={activePage === totalPages}
            title="Last page"
          >
            ≫
          </button>
        </div>

        {/* Page info */}
        <div className="page-info">
          Page {activePage} of {totalPages}
        </div>
      </div>
    </Provider>
  );
}

Pagination.propTypes = {
  spritemap: PropTypes.string,
  className: PropTypes.string,
  activePage: PropTypes.number,
  onPageChange: PropTypes.func,
  totalPages: PropTypes.number,
  totalItems: PropTypes.number,
  activeDelta: PropTypes.number,
  deltas: PropTypes.array,
  onDeltaChange: PropTypes.func,
  showItemsPerPage: PropTypes.bool,
};