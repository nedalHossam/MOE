import React, {useMemo, useState} from 'react';
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
}) {
    // Ensure spritemap is properly formatted
    const finalSpritemap = spritemap || '/o/classic-theme/images/lexicon/icons.svg';
    
    // Debug: Log the spritemap being used
    console.log('Table spritemap:', finalSpritemap);
    const [sort, setSort] = useState(null);
    const [internalPage, setInternalPage] = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(10);
    const [showContextMenu, setShowContextMenu] = useState(null);

    const page = controlledPage || internalPage;
    const pageSize = controlledPageSize || internalPageSize;
    const handlePageChange = onPageChange || setInternalPage;
    const handlePageSizeChange = onPageSizeChange || setInternalPageSize;

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

    // Pagination logic
    const pagedItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, page, pageSize]);

    const paginationDeltas = deltas || [
        {label: 5},
        {label: 10},
        {label: 20},
        {label: 50},
    ];

    const handleContextMenu = (event, rowId) => {
        event.preventDefault();
        setShowContextMenu(showContextMenu === rowId ? null : rowId);
    };

    const handleRowAction = (action, row) => {
        setShowContextMenu(null);
        if (onRowAction) {
            onRowAction(action, row);
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
                    <ClayTable onSortChange={setSort} sort={sort} spritemap={finalSpritemap}>
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
                                    Actions
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
                                                    onClick={(e) => handleContextMenu(e, row.id || index)}
                                                >
                                                    ⋯
                                                </button>
                                                {showContextMenu === (row.id || index) && (
                                                    <div className="context-menu">
                                                        {actions.map(action => (
                                                            <button
                                                                key={action.key}
                                                                className="context-menu-item"
                                                                onClick={() => handleRowAction(action.key, row)}
                                                            >
                                                                {action.icon && <span className="action-icon">{action.icon}</span>}
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

                {/* Enhanced Pagination */}
                <div className="pagination-container">
                    <Pagination
                        activePage={page}
                        onPageChange={handlePageChange}
                        totalPages={Math.ceil((typeof totalItems === 'number' ? totalItems : filteredItems.length) / pageSize)}
                        totalItems={typeof totalItems === 'number' ? totalItems : filteredItems.length}
                        activeDelta={pageSize}
                        deltas={paginationDeltas}
                        onDeltaChange={handlePageSizeChange}
                    />
                </div>
            </div>
            </ClayModalProvider>
                </ClayIconSpriteContext.Provider>

    </Provider>
    );
} 