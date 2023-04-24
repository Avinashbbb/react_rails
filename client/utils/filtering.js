import { orderBy } from 'lodash';

export const filteringState = {
  filter: '',
  limit: 10,
  page: 0,
};

export const handleChangeBoolFilter = function handleChangeBoolFilter(name, callback = null) {
  return () => {
    this.setState({
      errors: {
        ...this.state.errors,
        [name]: false,
      },
      [name]: !this.state[name],
      page: 0,
    }, callback);
  };
};

export const handleFilter = callback => function filter(event) {
  event.persist();

  this.setState({
    filter: event.target.value,
    // page: 0,
  }, callback);
};

export const handlePageChange = callback => function pageChange(_, page) {
  this.setState({
    page,
  }, callback);
};

export const handleRowsPerPageChange = callback => function rowsPerPage({ target }) {
  this.setState({
    limit: target.value,
    page: 0,
  }, callback);
};

export const handleSort = function sort(name, callback = null) {
  return () => {
    const { columnName, direction } = this.state.sort;

    let newColumnName = name;
    let newDirection = 'asc';

    if (columnName === name) {
      switch (direction) {
        case 'asc': {
          newDirection = 'desc';
          break;
        }
        case 'desc': {
          newColumnName = null;
          newDirection = undefined;
          break;
        }
        default: {
          break;
        }
      }
    }

    this.setState({
      sort: {
        columnName: newColumnName,
        direction: newDirection,
        page: 0,
      },
    }, callback);
  };
};

export const sortedData = (data, state) => {
  const { columnName, direction } = state.sort;

  return orderBy(data, [columnName], [direction]);
};
