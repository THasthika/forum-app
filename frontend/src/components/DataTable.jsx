import { Search } from '@mui/icons-material';
import {
  Box,
  FormControl,
  Input,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  TableFooter,
  TablePagination,
} from '@mui/material';
import React, { useState, useCallback, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const DataTable = ({
  columns,
  data,
  actions,
  page = 0,
  totalCount = 0,
  defaultSort = [null, null],
  noSearch = false,
  rowsPerPageList = [5, 10, 15, 20, 25, 30],
  searchBy = [],
  onNext = () => {},
  onPrev = () => {},
  onSearch = (searchText, searchBy, sort, rowsPerPage) => {},
}) => {
  const [sort, setSort] = useState(defaultSort);
  const [searchText, setSearchText] = useState('');
  const [searchSubmitText, setSearchSubmitText] = useState(searchText);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageList[0]);

  const nextSortState = (sort) => {
    switch (sort) {
      case 'asc':
        return 'desc';
      case 'desc':
        return null;
      default:
        return 'asc';
    }
  };

  const searchSubmit = useDebouncedCallback(() => {
    const sortKey = sort[0];
    let sortDir = sort[1];
    if (sortKey !== null && sortDir !== null) {
      sortDir = sortDir.toUpperCase();
    }
    onSearch(searchSubmitText, searchBy, [sortKey, sortDir], rowsPerPage);
  }, 300);

  const onSortToggle = useCallback(
    (name) => {
      let dir = null;
      if (sort[0] === name) {
        // toggle desc to asc or asc to desc
        dir = sort[1];
      }
      dir = nextSortState(dir);
      if (dir === null) {
        name = null;
      }
      setSort([name, dir]);
    },
    [sort],
  );

  const onPageChange = useCallback(
    (e, newPage) => {
      if (newPage > page) {
        onNext();
      } else {
        onPrev();
      }
    },
    [onNext, onPrev, page],
  );

  const onRowsPerPageChange = useCallback((e, data) => {
    const newRowsPerPage = data.props.value || 5;
    setRowsPerPage(newRowsPerPage);
  }, []);

  const onSearchTextSubmit = useCallback(() => {
    setSearchSubmitText(searchText);
  }, [searchText]);

  useEffect(() => {
    searchSubmit();
  }, [sort, rowsPerPage, searchSubmitText, searchSubmit]);

  return (
    <Box>
      {!noSearch && (
        <Box textAlign="right" mb={1}>
          <FormControl>
            <Input
              id="users-table-search"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyUp={(e) => {
                if (e.code === 'Enter') {
                  onSearchTextSubmit();
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTextSubmit}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Actions</TableCell>
            {columns.map((column) => (
              <TableCell key={column.name}>
                {column.sortable ? (
                  <TableSortLabel
                    active={column.name === sort[0]}
                    direction={column.name === sort[0] ? sort[1] : 'asc'}
                    onClick={() => onSortToggle(column.name)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {actions.map((action, i) => (
                  <IconButton
                    key={i}
                    onClick={() => action.onClick(row)}
                    title={action.label}
                  >
                    {action.icon}
                  </IconButton>
                ))}
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.name}>
                  {column.render
                    ? column.render(row[column.name])
                    : row[column.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              page={page}
              count={totalCount}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageList}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Box>
  );
};

export default DataTable;
