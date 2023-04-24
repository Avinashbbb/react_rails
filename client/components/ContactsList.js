import AddIcon from '@material-ui/icons/Add';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { debounce } from 'lodash';
import { withContacts } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import FloatingActionButton from './ui/FloatingActionButton';
import ModalContact from './ModalContact';
import ModalWarning from './ModalWarning';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableCellNoData from './ui/TableCellNoData';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import TablePaginationWrapper from './ui/TablePaginationWrapper';
import TextFieldUi from './ui/TextField';
import { formattedPhoneNumber } from '../utils/phoneNumber';

import {
  filteringState,
  handleFilter,
  handlePageChange,
  handleRowsPerPageChange,
  handleSort,
  sortedData,
} from '../utils/filtering';

const data = {
  cellPhone: { label: <FormattedMessage id="contact.cell_phone" /> },
  email: { label: <FormattedMessage id="contact.email" /> },
  homePhone: { label: <FormattedMessage id="contact.home_phone" /> },
  name: { label: <FormattedMessage id="contact.name" /> },
  workPhone: { label: <FormattedMessage id="contact.work_phone" /> },
};

class ContactsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    contactModalOpened: false,
    contactToEdit: {},
    contactToDelete: null,
    deleteContactModalOpened: false,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchContacts();
  }

  componentWillUnmount() {
    this.props.flushContacts();
  }

  debouncedFetchContacts = debounce(() => {
    this.fetchContacts();
  }, 300);

  fetchContacts = () => {
    const { filter, limit, page } = this.state;

    this.props.fetchContacts(this.props.match.params.customerId, {
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
      this.fetchContacts,
    );
  };

  handleDeleteContact = async () => {
    const { deleteContact, match } = this.props;

    await deleteContact(match.params.customerId, this.state.contactToDelete);

    const { contactToDelete, deleteContactModalOpened } = this.initialState;

    this.setState({
      contactToDelete,
      deleteContactModalOpened,
    }, this.fetchContacts);
  };

  handleFilter = handleFilter(this.debouncedFetchContacts).bind(this);
  handlePageChange = handlePageChange(this.fetchContacts).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchContacts).bind(this);
  handleSort = handleSort.bind(this);

  handleToggleContactModal = (opened, contact) => () => {
    const contactToEdit = opened ? contact : this.initialState.contactToEdit;

    this.setState({
      contactModalOpened: opened,
      contactToEdit,
    });
  };

  handleToggleDeleteContactModal = (opened, contactId) => () => {
    const contactToDelete = opened ? contactId : this.initialState.contactToDelete;

    this.setState({ deleteContactModalOpened: opened, contactToDelete });
  };

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['name', 'email', 'homePhone', 'workPhone', 'cellPhone'].map(name => (
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

          <TableCell />
        </TableRow>
      </TableHead>
    );
  };

  renderTableRows = () => {
    const { contacts, contactsLoading } = this.props;
    if (contactsLoading) {
      return <TableLoading />;
    }

    if (!contacts.length) {
      return <TableCellNoData />;
    }

    return sortedData(contacts, this.state).map((contact) => {
      const {
        id,
        cellPhone,
        email,
        firstName,
        homePhone,
        lastName,
        workPhone,
        workPhoneExt,
      } = contact;

      return (
        <TableRow key={id}>
          <TableCell>{lastName} {firstName}</TableCell>
          <TableCell>{email}</TableCell>
          <TableCell>
            {formattedPhoneNumber(homePhone)}
          </TableCell>
          <TableCell>
            {formattedPhoneNumber(workPhone)}
            {workPhoneExt ? ` #${workPhoneExt}` : ''}
          </TableCell>
          <TableCell>
            {formattedPhoneNumber(cellPhone)}
          </TableCell>
          <TableCell classes={{ root: 'action-cell' }}>
            <IconButton id="cpbr-edit-contact" onClick={this.handleToggleContactModal(true, contact)}>
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton id="cpbr-delete-contact" onClick={this.handleToggleDeleteContactModal(true, id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      contactToEdit, deleteContactModalOpened, filter, limit, page,
    } = this.state;

    const actionName = contactToEdit.id ? <FormattedMessage id="edit" /> : <FormattedMessage id="add" />;

    return (
      <PageContainer>
        <PaperWrapper>
          <div>
            <FloatingActionButton
              onClick={this.handleToggleContactModal(true, this.initialState.contactToEdit)}
            >
              <AddIcon />
            </FloatingActionButton>
          </div>

          <TableOverflowWrapper>
            <Toolbar>
              <TextFieldUi
                id="cpbr-filtre"
                label={<FormattedMessage id="filter" />}
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
            count={this.props.contactsCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />
        </PaperWrapper>

        <ModalContact
          key={contactToEdit.id}
          actionName={actionName}
          contact={contactToEdit}
          onClose={this.handleToggleContactModal(false)}
          open={this.state.contactModalOpened}
          refreshList={this.fetchAndResetPagination}
        />

        <ModalWarning
          onCancel={this.handleToggleDeleteContactModal(false)}
          onSubmit={this.handleDeleteContact}
          open={deleteContactModalOpened}
          title={<FormattedMessage id="warning" />}
        >
          <FormattedMessage id="warning_delete_contact" />
        </ModalWarning>
      </PageContainer>
    );
  }
}
ContactsList.defaultProps = {
  contactsLoading: true,
};

ContactsList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  contactsCount: PropTypes.number.isRequired,
  contactsLoading: PropTypes.bool,
  deleteContact: PropTypes.func.isRequired,
  fetchContacts: PropTypes.func.isRequired,
  flushContacts: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default withContacts(ContactsList);
