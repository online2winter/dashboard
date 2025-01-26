import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TableContainer = styled.div`
width: 100%;
overflow-x: auto;
background: ${props => props.theme.colors.background};
border-radius: 8px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
width: 100%;
border-collapse: collapse;
min-width: 600px;

th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
}

th {
    background: ${props => props.theme.colors.backgroundAlt};
    cursor: pointer;
    user-select: none;
    
    &:hover {
    background: ${props => props.theme.colors.backgroundHover};
    }
}

tr:last-child td {
    border-bottom: none;
}

tbody tr {
    &:hover {
    background: ${props => props.theme.colors.backgroundHover};
    }

    &.selected {
    background: ${props => props.theme.colors.backgroundSelected};
    }
}
`;

const Pagination = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px;
background: ${props => props.theme.colors.backgroundAlt};
border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button`
padding: 8px 16px;
border-radius: 4px;
border: 1px solid ${props => props.theme.colors.border};
background: ${props => props.theme.colors.background};
cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
opacity: ${props => props.disabled ? 0.5 : 1};

&:hover:not(:disabled) {
    background: ${props => props.theme.colors.backgroundHover};
}
`;

const LoadingOverlay = styled.div`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(255, 255, 255, 0.8);
display: flex;
align-items: center;
justify-content: center;
`;

const Table = React.memo(({
columns,
data,
loading,
selectable,
onRowSelect,
selectedRows,
pageSize = 10
}) => {
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
const [currentPage, setCurrentPage] = useState(1);

const handleSort = useCallback((key) => {
    setSortConfig(prevSort => ({
    key,
    direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
}, []);

const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
    });
}, [data, sortConfig]);

const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
}, [sortedData, currentPage, pageSize]);

const totalPages = Math.ceil(data.length / pageSize);

const handleRowClick = useCallback((row) => {
    if (selectable && onRowSelect) {
    onRowSelect(row);
    }
}, [selectable, onRowSelect]);

const isSelected = useCallback((row) => {
    return selectedRows?.some(selectedRow => selectedRow.id === row.id);
}, [selectedRows]);

return (
    <TableContainer>
    {loading && (
        <LoadingOverlay>
        <div>Loading...</div>
        </LoadingOverlay>
    )}
    <StyledTable>
        <thead>
        <tr>
            {columns.map(column => (
            <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                style={{ width: column.width }}
            >
                {column.label}
                {sortConfig.key === column.key && (
                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
            </th>
            ))}
        </tr>
        </thead>
        <tbody>
        {paginatedData.map((row, index) => (
            <tr
            key={row.id || index}
            onClick={() => handleRowClick(row)}
            className={isSelected(row) ? 'selected' : ''}
            >
            {columns.map(column => (
                <td key={column.key}>
                {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
            ))}
            </tr>
        ))}
        </tbody>
    </StyledTable>
    <Pagination>
        <span>{`Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, data.length)} of ${data.length} entries`}</span>
        <div>
        <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
        >
            Previous
        </Button>
        <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
        >
            Next
        </Button>
        </div>
    </Pagination>
    </TableContainer>
);
});

Table.propTypes = {
columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    width: PropTypes.string,
    render: PropTypes.func
})).isRequired,
data: PropTypes.arrayOf(PropTypes.object).isRequired,
loading: PropTypes.bool,
selectable: PropTypes.bool,
onRowSelect: PropTypes.func,
selectedRows: PropTypes.arrayOf(PropTypes.object),
pageSize: PropTypes.number
};

Table.defaultProps = {
loading: false,
selectable: false,
pageSize: 10,
selectedRows: []
};

export default Table;

