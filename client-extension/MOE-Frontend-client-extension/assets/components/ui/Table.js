import React, {useEffect, useMemo, useState} from 'react';
import {Body, Cell, Text, Head, Row, Table as ClayTable, Provider} from '@clayui/core';
import { ClayModalProvider } from '@clayui/modal';
import  { ClayIconSpriteContext } from '@clayui/icon';
import '@clayui/css/lib/css/atlas.css';
import Pagination from './Pagination';

/**
 * Table component with modern design
 * @param {Object[]} items - Array of data objects to display in the table
 * @param {Object[]} columns - Array of column definitions: { key, label, sortable, render? }
 * @param {string} [spritemap] - Optional spritemap path for icons
 * @param {number} [page] - Current page (1-based)
 * @param {number} [pageSize] - Items per page
 * @param {function} [onPageChange] - Callback for page change
 * @param {function} [onPageSizeChange] - Callback for page size change
 * @param {number} [totalItems] - Total number of items (for pagination)
 * @param {Array} [deltas] - Array of page size options for pagination
 * @param {Array} [actions] - Array of action objects: { key, label, icon? }
 * @param {boolean} [showActions] - Whether to show actions column
 * @param {function} [onRowAction] - Callback for row actions
 * @param {Object} [sort] - Controlled sort state: { column, direction }
 * @param {function} [onSortChange] - Callback for sort change: (sort) => void
 */
export default function Table({
    items,
    columns,
    spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`,
    page: controlledPage,
    pageSize: controlledPageSize,
    onPageChange,
    onPageSizeChange,
    totalItems,
    deltas,
    actions = [
        { key: 'details', label: 'Vehicle Details' },
        { key: 'edit', label: 'Edit Vehicle' }
    ],
    showActions = true,
    onRowAction,
    sort: controlledSort,
    onSortChange,
    actionsLabel = 'Actions',
}) {
    // Ensure spritemap is properly formatted
    const finalSpritemap = spritemap || '/o/classic-theme/images/lexicon/icons.svg';

    // Debug: Log the spritemap being used
    console.log('Table spritemap:', finalSpritemap);
    const [internalSort, setInternalSort] = useState(null);
    const [internalPage, setInternalPage] = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(10);
    const [showContextMenu, setShowContextMenu] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const updateIsMobile = (event) => {
            setIsMobileView(event.matches);
        };

        setIsMobileView(mediaQuery.matches);
        mediaQuery.addEventListener('change', updateIsMobile);

        return () => {
            mediaQuery.removeEventListener('change', updateIsMobile);
        };
    }, []);

    useEffect(() => {
        if (!showContextMenu) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeContextMenu();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showContextMenu]);

    const docDirection = typeof document !== 'undefined'
        ? document.documentElement.getAttribute('dir') || 'ltr'
        : 'ltr';

    const closeContextMenu = () => {
        setShowContextMenu(null);
        setActiveRow(null);
    };


    const sort = controlledSort !== undefined ? controlledSort : internalSort;
    
    // Determine if pagination should be enabled
    // Pagination is enabled only if at least one pagination prop is provided
    const paginationEnabled = controlledPage !== undefined || 
                               controlledPageSize !== undefined || 
                               onPageChange !== undefined || 
                               onPageSizeChange !== undefined ||
                               totalItems !== undefined;
    
    const page = paginationEnabled ? (controlledPage || internalPage) : 1;
    // When pagination is disabled, use a large number so all items are shown
    const pageSize = paginationEnabled ? (controlledPageSize || internalPageSize) : 10000;
    const handlePageChange = onPageChange || setInternalPage;
    const handlePageSizeChange = onPageSizeChange || setInternalPageSize;

    const handleSortChange = (newSort) => {
        // Update URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (newSort && newSort.column) {
            urlParams.set('sortBy', newSort.column);
            urlParams.set('sortOrder', newSort.direction || 'ascending');
        } else {
            urlParams.delete('sortBy');
            urlParams.delete('sortOrder');
        }
        const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
        window.history.pushState({}, '', newUrl);

        // Update internal state if not controlled
        if (controlledSort === undefined) {
            setInternalSort(newSort);
        }

        // Call parent callback if provided
        if (onSortChange) {
            onSortChange(newSort);
        }
    };

    const filteredItems = useMemo(() => {
        let filtered = items;

        // Apply sorting
        if (sort) {
            filtered = [...filtered].sort((a, b) => {
                let cmp = new Intl.Collator('en', {numeric: true}).compare(
                    a[sort.column],
                    b[sort.column]
                );
                if (sort.direction === 'descending') cmp *= -1;
                return cmp;
            });
        }

        return filtered;
    }, [sort, items]);

    // Pagination logic - only paginate if pagination is enabled
    // If totalItems is provided, assume server-side pagination (items are already paginated from server)
    // In that case, don't slice the items - display them as-is
    const isServerSidePagination = totalItems !== undefined;
    const pagedItems = useMemo(() => {
        if (!paginationEnabled) {
            return filteredItems;
        }
        // If server-side pagination, return items as-is (already paginated from server)
        if (isServerSidePagination) {
            return filteredItems;
        }
        // Otherwise, do client-side pagination
        const start = (page - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, page, pageSize, paginationEnabled, isServerSidePagination]);

    const paginationDeltas = deltas || [
        {label: 5},
        {label: 10},
        {label: 20},
        {label: 50},
    ];

    const handleContextMenu = (event, rowData, rowId) => {
        event.preventDefault();
        event.stopPropagation();

        if (showContextMenu === rowId) {
            closeContextMenu();
        } else {
            setShowContextMenu(rowId);
            setActiveRow(rowData);
        }
    };

    const handleRowAction = (action, row) => {
        const targetRow = row || activeRow;
        closeContextMenu();
        if (onRowAction && targetRow) {
            onRowAction(action, targetRow);
        }
    };

    const StatusBadge = ({ status }) => (
        <span className={`status-badge ${status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
            {status}
        </span>
    );

    return (
        <Provider spritemap="/o/classic-theme/images/lexicon/icons.svg">
        <ClayIconSpriteContext.Provider value="/o/classic-theme/images/lexicon/icons.svg">
          <ClayModalProvider>
            <div className="table-container">
                {/* Table */}
                <div className="table-wrapper">
                    <ClayTable onSortChange={handleSortChange} sort={sort} spritemap={finalSpritemap}>
                        <Head className="table-header">
                            {columns.map(col => (
                                <Cell
                                    key={col.key}
                                    sortable={col.sortable}
                                    className="table-header-cell"
                                >
                                    {col.label}
                                </Cell>
                            ))}
                            {showActions && (
                                <Cell className="table-header-cell">
                                    {actionsLabel}
                                </Cell>
                            )}
                        </Head>
                        <Body defaultItems={pagedItems}>
                            {(row, index) => (
                                <Row
                                    key={row.id || index}
                                    className="table-row"
                                >
                                    {columns.map(col => (
                                        <Cell
                                            key={col.key}
                                            className="table-cell"
                                        >
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : col.key === 'status' ? (
                                                    <StatusBadge status={row[col.key]} />
                                                ) : col.key === 'name' ? (
                                                    <Text size={3} weight="semi-bold">{row[col.key]}</Text>
                                                ) : (
                                                    row[col.key]
                                                )}
                                        </Cell>
                                    ))}
                                    {showActions && (
                                        <Cell className="table-cell">
                                            <div className="action-cell">
                                                <button
                                                    className="context-menu-trigger"
                                                    onClick={(e) => handleContextMenu(e, row, row.id || index)}
                                                >
                                                    ⋯
                                                </button>
                                                {showContextMenu === (row.id || index) && !isMobileView && (
                                                    <div className="context-menu">
                                                        {actions.map(action => (
                                                            <button
                                                                key={action.key}
                                                                className="context-menu-item"
                                                                onClick={() => handleRowAction(action.key, row)}
                                                            >
                                                               {action.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Cell>
                                    )}
                                </Row>
                            )}
                        </Body>
                    </ClayTable>
                </div>
                {isMobileView && showContextMenu !== null && activeRow && (
                    <>
                        <div
                            className="mobile-action-overlay"
                            onClick={closeContextMenu}
                        />
                        <div className="mobile-action-menu" dir={docDirection}>
                            <div className="mobile-action-menu-header">
                                <span>{actionsLabel}</span>
                                <button
                                    type="button"
                                    className="mobile-action-menu-close"
                                    onClick={closeContextMenu}
                                    aria-label="Close actions menu"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mobile-action-menu-content">
                                {actions.map((action) => (
                                    <button
                                        key={action.key}
                                        type="button"
                                        className="mobile-action-menu-item"
                                        onClick={() => handleRowAction(action.key)}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {/* Enhanced Pagination - only show if pagination is enabled */}
                {paginationEnabled && (
                    <div className="pagination-container">
                        <Pagination
                            activePage={page}
                            onPageChange={handlePageChange}
                            totalPages={Math.ceil((typeof totalItems === 'number' ? totalItems : filteredItems.length) / pageSize)}
                            totalItems={typeof totalItems === 'number' ? totalItems : filteredItems.length}
                            activeDelta={pageSize}
                            deltas={paginationDeltas}
                            onDeltaChange={handlePageSizeChange}
                            showItemsPerPage={false}
                        />
                    </div>
                )}
            </div>
            </ClayModalProvider>
                </ClayIconSpriteContext.Provider>

    </Provider>
    );
}