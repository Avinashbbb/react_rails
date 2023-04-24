import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { sortBy } from 'lodash';
import moment from 'moment';
import { withComments, withJob } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';

import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableCellNoData from './ui/TableCellNoData';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';

const tableHead = {
  day: <FormattedMessage id="day" />,
  hour: <FormattedMessage id="hour" />,
  text: <FormattedMessage id="comment" />,
};

class InterventionsList extends PureComponent {
  state = {};

  componentDidMount() {
    this.fetchComments();
  }

  componentWillUnmount() {
    this.props.flushComments();
  }

  fetchComments = () => {
    const { fetchJobComments, match } = this.props;

    fetchJobComments(match.params.jobId);
  };

  renderTableHead = () => (
    <TableHead>
      <TableRow>
        {['day', 'hour', 'text'].map(name => (
          <TableCell key={name}>
            {tableHead[name]}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  renderTableRows = () => {
    const { comments, commentsLoading } = this.props;

    if (commentsLoading) {
      return <TableLoading />;
    }

    if (!comments.length) {
      return <TableCellNoData />;
    }

    return sortBy(comments, ['createdAt']).map((comment) => {
      const { id, createdAt, message } = comment;

      return (
        <TableRow key={id}>
          <TableCell><FormattedDate value={moment(createdAt)} year="numeric" month="long" day="numeric" /></TableCell>
          <TableCell><FormattedTime value={moment(createdAt)} /></TableCell>
          <TableCell>{message}</TableCell>
        </TableRow>
      );
    })
  };

  render() {
    return (
      <PageContainer>
        <PaperWrapper>
          <TableOverflowWrapper>
            <Table>
              {this.renderTableHead()}

              <TableBody>
                {this.renderTableRows()}
              </TableBody>
            </Table>
          </TableOverflowWrapper>
        </PaperWrapper>
      </PageContainer>
    );
  }
}

InterventionsList.defaultProps = {
  commentsLoading: true,
};

InterventionsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchJobComments: PropTypes.func.isRequired,
  flushComments: PropTypes.func.isRequired,
  commentsLoading: PropTypes.bool,
  match: PropTypes.object.isRequired,
};

export default withComments(withJob(InterventionsList));
