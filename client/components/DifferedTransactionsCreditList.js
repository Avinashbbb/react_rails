import { Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@material-ui/core';
import { withDifferedTransactions, withDeposits } from 'optigo-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableCellNoData from './ui/TableCellNoData';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import ModalPpaFileNumber from './ModalPpaFileNumber';
import ModalWarning from './ModalWarning';
import ModalDifferedTransactionCredit from './ModalDifferedTransactionCredit';
import { sortedData } from '../utils/filtering';
import InlineDatePickerWrapper from './ui/InlineDatePickerWrapper';
import { formattedDate } from '../utils/dates';

const data = {
  createdAt: { label: <FormattedMessage id="differed_transaction.created_at" /> },
  franchiseName: { label: <FormattedMessage id="differed_transaction.franchise_name" /> },
  status: { label: <FormattedMessage id="differed_transaction.status" /> },
  amount: { label: <FormattedMessage id="differed_transaction.amount" /> },
  actions: { label: <FormattedMessage id="actions" /> },
  weekDescription: { label: <FormattedMessage id="calendar.week" /> },
};

class DifferedTransactionsCreditList extends PureComponent {
  initialSort = {
    columnName: 'weekDescription',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    differedTransactionToEdit: {},
    manuallyDifferedTransactionToEdit: null,
    editManuallyDifferedTransactionModalOpened: false,
    differedTransactionModalOpened: false,
    scopeEndAtMax: moment().add(-1, 'days'),
    scopeEndAt: formattedDate(moment().add(-1, 'days')),
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchDifferedTransactions();
    this.fetchLastDepositInfo();
  }

  componentWillUnmount() {
    this.props.flushDifferedTransactions();
  }

  fetchLastDepositInfo = async () => {
    const { fetchLastDepositInfo } = this.props;
    fetchLastDepositInfo();
  };

  fetchDifferedTransactions = () => {
    const { fetchDifferedTransactions } = this.props;

    fetchDifferedTransactions({
      processed: false,
      transactionType: 'credit',
      status: 'to_process',
    });
  };

  handleManuallyDifferedTransaction = async () => {
    const { editDifferedTransaction } = this.props;

    await editDifferedTransaction({
      status: 'processed_manually',
    }, this.state.manuallyDifferedTransactionToEdit);

    const { manuallyDifferedTransactionToEdit, editManuallyDifferedTransactionModalOpened } = this.initialState;

    this.setState({
      manuallyDifferedTransactionToEdit,
      editManuallyDifferedTransactionModalOpened,
    }, this.fetchDifferedTransactions);
  };

  handleToggleManuallyDifferedTransactionModal = (opened, differedTransactionId) => () => {
    const manuallyDifferedTransactionToEdit = opened ? differedTransactionId : this.initialState.manuallyDifferedTransactionToEdit;

    this.setState({ editManuallyDifferedTransactionModalOpened: opened, manuallyDifferedTransactionToEdit });
  };

  handleToggleDifferedTransactionModal = (opened, differedTransaction) => () => {
    const differedTransactionToEdit = opened ? differedTransaction : this.initialState.differedTransactionToEdit;
    this.setState({
      differedTransactionToEdit,
      differedTransactionModalOpened: opened,
    });
  };

  renderTableHead = () => {
    const basicHeaders = ['createdAt', 'franchiseName', 'weekDescription', 'status', 'amount', 'actions'];

    return (
      <TableHead>
        <TableRow>
          {basicHeaders.map(name => (
            <TableCell key={name}>
              {data[name].label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  renderTableRows = () => {
    const { differedTransactions, differedTransactionsLoading } = this.props;

    if (differedTransactionsLoading) {
      return <TableLoading />;
    }

    if (!differedTransactions.length) {
      return <TableCellNoData />;
    }

    return sortedData(differedTransactions, this.state).map((differedTransaction) => {
      const {
        id, createdAt, accountStatement, status, amount,
      } = differedTransaction;
      let franchiseName = '';
      let weekDescription = '';

      if (accountStatement) {
        const { scopeEndAt, scopeStartAt } = accountStatement.data.attributes;
        franchiseName = accountStatement.data.attributes.franchiseName;
        weekDescription = `${moment(scopeStartAt).format('YYYY-MM-DD')} - ${moment(scopeEndAt).format('YYYY-MM-DD')}`;
      }

      return (
        <TableRow key={id}>
          <TableCell>{moment(createdAt).format('YYYY-MM-DD')}</TableCell>
          <TableCell>{franchiseName}</TableCell>
          <TableCell>{weekDescription}</TableCell>
          <TableCell>{status}</TableCell>
          <TableCell>{amount}</TableCell>
          <TableCell classes={{ root: 'action-cell' }}>
            <IconButton onClick={this.handleToggleDifferedTransactionModal(true, differedTransaction)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={this.handleToggleManuallyDifferedTransactionModal(true, id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  handleCreateWeeklyDeposit = async (scopeStartAt) => {
    const { performWeeklyDeposit } = this.props;
    const { scopeEndAt } = this.state;

    const params = {
      scope_start_at: scopeStartAt,
      scope_end_at: scopeEndAt,
    };

    const success = await performWeeklyDeposit(params);

    if (success) {
      await this.fetchLastDepositInfo();
      await this.fetchDifferedTransactions();

      this.setState({
        scopeEndAt: formattedDate(moment().add(-1, 'days')),
      });
    }
  }

  handleChangeDate = (date) => {
    this.setState({ scopeEndAt: formattedDate(date) });
  }

  handleVerifyMaxDate = (formattedStartAt, scopeEndAtMax) =>
    formattedDate(formattedStartAt) > formattedDate(scopeEndAtMax) ||
    formattedDate(formattedStartAt) === formattedDate(scopeEndAtMax)

  renderCreateDeposit = () => {
    const { scopeEndAt, scopeEndAtMax } = this.state;
    const { scopeStartAt, depositLoading } = this.props;

    const formattedStartAt = moment(scopeStartAt).add(1, 'days');
    const dateIsInValid = this.handleVerifyMaxDate(formattedStartAt, scopeEndAtMax);

    if (scopeStartAt && scopeEndAtMax) {
      return (
        <row>
          <div>
            <InlineDatePickerWrapper
              style={{ marginLeft: 20 }}
              id="cpbr-date"
              format="LL"
              keyboard
              label="Date"
              value={formattedStartAt} // last deposit end + 1 day
              variant="outlined"
              disabled
            />

            <InlineDatePickerWrapper
              style={{ marginLeft: 20 }}
              id="cpbr-date"
              format="LL"
              keyboard
              label="Date"
              variant="outlined"
              value={scopeEndAt} // default is yesterday
              minDate={moment(formattedStartAt).add(1, 'days')}
              maxDate={scopeEndAtMax}
              onChange={this.handleChangeDate}
              disabled={dateIsInValid || depositLoading}
              minDateMessage={<FormattedMessage id="differed_transaction.date_error" />}
              maxDateMessage={<FormattedMessage id="differed_transaction.date_error" />}
              disableFuture
            />

            {depositLoading ?
              <CircularProgress style={{ marginLeft: 250 }} color="primary" /> :
              <Button
                disabled={dateIsInValid}
                style={{ marginLeft: 50 }}
                id="depositButton"
                color="default"
                variant="contained"
                onClick={() => this.handleCreateWeeklyDeposit(formattedStartAt)}
              >
                <FormattedMessage id="differed_transaction.generate_deposit" />
              </Button>
             }

          </div>
        </row>
      );
    }
  }

  render() {
    const {
      differedTransactionToEdit, editManuallyDifferedTransactionModalOpened,
    } = this.state;
    const { fileNumber } = this.props;

    return (
      <PageContainer>
        <PaperWrapper>

          {this.renderCreateDeposit()}

          <TableOverflowWrapper>
            <Table>
              {this.renderTableHead()}

              <TableBody>
                {this.renderTableRows()}
              </TableBody>
            </Table>

            <ModalPpaFileNumber
              refreshList={this.fetchDifferedTransactions}
              fileToGenerate="ddd"
              fileNumber={fileNumber}
              handleTogglePpaFileNumberModal={null}
            />

          </TableOverflowWrapper>

          <ModalWarning
            onCancel={this.handleToggleManuallyDifferedTransactionModal(false)}
            onSubmit={this.handleManuallyDifferedTransaction}
            open={editManuallyDifferedTransactionModalOpened}
            title={<FormattedMessage id="warning" />}
          >
            <FormattedMessage id="warning_manually_process_transaction" />
          </ModalWarning>

          <ModalDifferedTransactionCredit
            key={differedTransactionToEdit.id}
            differedTransactionCredit={differedTransactionToEdit}
            onClose={this.handleToggleDifferedTransactionModal(false)}
            open={this.state.differedTransactionModalOpened}
            refreshList={this.fetchDifferedTransactions}
          />

        </PaperWrapper>
      </PageContainer>
    );
  }
}

DifferedTransactionsCreditList.defaultProps = {
  differedTransactions: [],
  differedTransactionsLoading: true,
};

DifferedTransactionsCreditList.propTypes = {
  differedTransactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  differedTransactionsLoading: PropTypes.bool,
  editDifferedTransaction: PropTypes.func.isRequired,
  fetchDifferedTransactions: PropTypes.func.isRequired,
  flushDifferedTransactions: PropTypes.func.isRequired,
  fetchLastDepositInfo: PropTypes.func.isRequired,
  performWeeklyDeposit: PropTypes.func.isRequired,
  depositLoading: PropTypes.bool.isRequired,
  scopeStartAt: PropTypes.string.isRequired,
  fileNumber: PropTypes.string.isRequired,
};

export default withDeposits(withDifferedTransactions(DifferedTransactionsCreditList));
