import { Badge, Icon, IconButton } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CtaButton from "../ui/CtaButton";
import InlineDatePickerWrapper from '../ui/InlineDatePickerWrapper';
import Tooltip from '../ui/Tooltip';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  > *{
    margin-left: 10px;
  }
`;

class ActionBar extends React.Component {
  renderUnpublished = (unpublishedCount) => {
    const icon = <Icon>tap_and_play</Icon>;

    if (!unpublishedCount) {
      return icon;
    }

    return (
      <Badge id="cpbr-unpublished-all" badgeContent={unpublishedCount} color="secondary">
        {icon}
      </Badge>
    );
  };

  render() {
    const {
      changeCurrentDate, currentDate, openAddJobModal, refreshJobs, unpublishedCount,
    } = this.props;

    return (
      <Wrapper>
        <InlineDatePickerWrapper
          id="cpbr-date"
          format="LL"
          keyboard
          label="Date"
          value={moment(currentDate)}
          onChange={changeCurrentDate}
          variant="outlined"
          disablePast
        />

        <Tooltip title={<FormattedMessage id="refresh" />} placement="top">
          <IconButton id="cpbr-refresh" onClick={refreshJobs}>
            <Icon>refresh</Icon>
          </IconButton>
        </Tooltip>

        <Tooltip title={<FormattedMessage id="dispatch" />} placement="top">
          <IconButton onClick={this.props.publishJobs(null, unpublishedCount)}>
            {this.renderUnpublished(unpublishedCount)}
          </IconButton>
        </Tooltip>

        <CtaButton onClick={openAddJobModal} />
      </Wrapper>
    );
  }
}

ActionBar.propTypes = {
  changeCurrentDate: PropTypes.func.isRequired,
  currentDate: PropTypes.string.isRequired,
  openAddJobModal: PropTypes.func.isRequired,
  publishJobs: PropTypes.func.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  unpublishedCount: PropTypes.number.isRequired,
};

export default ActionBar;
