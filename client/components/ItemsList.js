import {IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {debounce} from 'lodash';
import {withItems, withItemKinds, withItemSpecs} from 'optigo-redux';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import FloatingActionButton from './ui/FloatingActionButton';
import ModalItem from './ModalItem';
import ModalWarning from './ModalWarning';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import TablePaginationWrapper from './ui/TablePaginationWrapper';
import TextFieldUi from './ui/TextField';
import {
  filteringState,
  handleFilter,
  handlePageChange,
  handleRowsPerPageChange,
  handleSort,
  sortedData,
} from '../utils/filtering';

const data = {
  identifier: {label: <FormattedMessage id="items.identifier"/>},
  itemKind: {label: <FormattedMessage id="items.item_kind"/>},
  itemSpec: {label: <FormattedMessage id="items.item_spec"/>},
  status: {label: <FormattedMessage id="items.status"/>},
};

const ActionWrapper = styled.div`
`;


class ItemsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    deleteItemModalOpened: false,
    itemModalOpened: false,
    itemToEdit: {},
    itemToDelete: null,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchItems();
  }

  componentWillUnmount() {
    this.props.flushItems();
  }

  get items() {
    const {items, itemKinds, itemSpecs} = this.props;

    return items.map(({itemKindId, itemSpecId, ...remainingAttr}) => ({
      ...remainingAttr,
      itemKind: itemKinds.find(itemKind => itemKind.id === itemKindId).name,
      itemSpec: itemSpecs.find(itemSpec => itemSpec.id === itemSpecId).name,
    }));
  }

  debouncedFetchItems = debounce(() => {
    this.fetchItems();
  }, 300);

  fetchItems = () => {
    const {filter, limit, page} = this.state;

    this.props.fetchItems({
      filter: filter.trim(),
      page: page + 1,
      limit,
    });
  };

  fetchAndResetPagination = () => {
    this.setState(
      {
        ...this.initialState,
      },
      this.fetchItems,
    );
  };

  handleDeleteItem = async () => {
    const {deleteItem} = this.props;

    await deleteItem(this.state.itemToDelete);

    const {deleteItemModalOpened, itemToDelete} = this.initialState;

    this.setState({
      deleteItemModalOpened,
      itemToDelete,
    }, this.fetchItems);
  };

  handleFilter = handleFilter(this.debouncedFetchItems).bind(this);
  handlePageChange = handlePageChange(this.fetchItems).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchItems).bind(this);
  handleSort = handleSort.bind(this);

  handleToggleDeleteItemModal = (opened, itemId) => () => {
    const itemToDelete = opened ? itemId : this.initialState.itemToDelete;

    this.setState({deleteItemModalOpened: opened, itemToDelete});
  };

  handleToggleItemModal = (opened, item) => () => {
    const itemToEdit = opened ? item : this.initialState.itemToEdit;

    this.setState({
      itemModalOpened: opened,
      itemToEdit,
    });
  };

  renderTableHead = () => {
    const {columnName, direction} = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['identifier', 'itemKind', 'itemSpec', 'status'].map(name => (
            <TableCell key={name}>
              <TableSortLabel
                active={columnName === name}
                direction={direction}
                onClick={this.handleSort(name)}
              >
                {data[name].label}
              </TableSortLabel>
            </TableCell>
          ))}

          <TableCell/>
        </TableRow>
      </TableHead>
    );
  };

  renderTableRows = () => {
    const {itemsLoading} = this.props;

    if (itemsLoading) {
      return <TableLoading/>;
    }

    return sortedData(this.items, this.state).map((item) => {
      const {
        currentCustomerItemId,
        id,
        identifier,
        itemKind,
        itemSpec,
      } = item;

      const editableItem = this.props.items.find(({id: editableItemId}) => editableItemId === id);
      const usageLink = currentCustomerItemId ?
        <Link to={`/preparations/${currentCustomerItemId}`}><FormattedMessage id="used"/></Link> :
        <FormattedMessage id="available"/>;

      return (
        <TableRow key={identifier}>
          <TableCell>{identifier}</TableCell>
          <TableCell>{itemKind}</TableCell>
          <TableCell>{itemSpec}</TableCell>
          <TableCell>{usageLink}</TableCell>
          <TableCell classes={{root: 'action-cell'}}>
            <IconButton id="cpbr-edit-item" onClick={this.handleToggleItemModal(true, editableItem)}>
              <EditIcon fontSize="small"/>
            </IconButton>
            {
              !currentCustomerItemId &&
              <IconButton id="cpbr-delete-item" onClick={this.handleToggleDeleteItemModal(true, id)}>
                <DeleteIcon fontSize="small"/>
              </IconButton>
            }
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      deleteItemModalOpened, filter, itemToEdit, limit, page,
    } = this.state;

    const actionName = itemToEdit.id ? <FormattedMessage id="edit"/> : <FormattedMessage id="add"/>;

    return (
      <PageContainer>
        <PaperWrapper>
          <ActionWrapper>
            <FloatingActionButton
              onClick={this.handleToggleItemModal(true, this.initialState.itemToEdit)}
            >
              <AddIcon/>
            </FloatingActionButton>
          </ActionWrapper>

          <TableOverflowWrapper>
            <Toolbar>
              <TextFieldUi
                id="cpbr-filtre"
                label={<FormattedMessage id="filter"/>}
                onChange={this.handleFilter}
                type="search"
                value={filter}
              />
            </Toolbar>

            <Table>
              {this.renderTableHead()}

              <TableBody>
                {this.renderTableRows()}
              </TableBody>
            </Table>
          </TableOverflowWrapper>
          <TablePaginationWrapper
            component="div"
            count={this.props.itemsCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />
        </PaperWrapper>

        <ModalItem
          key={itemToEdit.id}
          actionName={actionName}
          item={itemToEdit}
          onClose={this.handleToggleItemModal(false)}
          open={this.state.itemModalOpened}
          refreshList={this.fetchAndResetPagination}
        />

        <ModalWarning
          onCancel={this.handleToggleDeleteItemModal(false)}
          onSubmit={this.handleDeleteItem}
          open={deleteItemModalOpened}
          title={<FormattedMessage id="warning"/>}
        >
          <FormattedMessage id="warning_delete_item"/>
        </ModalWarning>
      </PageContainer>
    );
  }
}

ItemsList.defaultProps = {
  itemsLoading: true,
};

ItemsList.propTypes = {
  fetchItems: PropTypes.func.isRequired,
  flushItems: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsCount: PropTypes.number.isRequired,
  itemKinds: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsLoading: PropTypes.bool,
  itemSpecs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withItems(withItemKinds(withItemSpecs(ItemsList)));
