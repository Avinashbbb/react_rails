import { CardContent as CardContentMui, Icon, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';

import SimpleBadge from './SimpleBadge';

const Area = styled.div`
  font-size: 0.9rem;
`;

const BagdesWrapper = styled.div`
  display: flex;
`;

const Card = styled.div`
  && {
    position: relative;
    width: 350px;
    margin-bottom: 10px;
    background: white;
    border-radius: 2px;
    
    ${({ status, theme }) => `
      border-left: solid 9px ${theme.app.taskStatusColor[status]};
      cursor: ${status === 'TODO' ? 'grab' : 'pointer'};
    `}    
 
    :hover, :focus { ${({ status }) => `${status === 'TODO' ? 'transform: rotate(-1deg)' : ''} ;`}  
    
    transition: transform 0.15s;
  }
`;

const CardContent = styled(CardContentMui)`
  &&:last-child{
    padding: 12px 18px;
    transition: all 0.2s;
 
    :hover {
      background: #f7f7f7;  
    }
  }
`;

const Content = styled.span`
`;

const Duration = styled.span`    
  margin-left: 10px;
  padding-left: 20px;
`;

const Delay = styled.div`
  display: inline-block;
  height: 21px;
  padding: 0 7px;
  background: ${({ theme }) => theme.app.warningColor};
  border-radius: 12px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  line-height: 21px;
  text-align: center;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
`;

const IconsWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  font-size: 0.8rem;
`;

const PlaceName = styled.div`
  display: inline-block;
  margin-top: 15px;
  font-size: 16px;
  font-weight: 500;
`;

const PlaceAddress = styled.span`
  color: ${({ theme }) => theme.app.lightFontColor};
  font-size: 0.9rem;
`;

const Instruction = styled.span`
  
`;

const IcoDuration = styled(Icon)`
  &&{
    position: absolute;
    margin-top: -1px;
    color: ${({ theme }) => theme.app.lightIconColor};;
    font-size: 16px;
    margin-left: -19px;
  }
`;

const IcoPaused = styled(Icon)`
  &&{  
    margin-left: 5px;
    color:  ${({ theme }) => theme.app.taskStatusColor.IN_PROGRESS};
    font-size: 26px;
  }
`;

class JobCard extends Component {
  renderOriginalStartDate = () => {
    const {intl, job} = this.props;
    const {originalStartDate} = job;
    const {formatMessage} = intl;

    if (originalStartDate) {
      return <Instruction>{`${formatMessage({id: 'jobs.creation_date'})}: ${moment(originalStartDate).format('YYYY-MM-DD')}`}</Instruction>;
    }
    return null;
  };

  renderAverageDuration = () => {
    const { averageDuration } = this.props.job;

    return !averageDuration ? null
      : <Duration><IcoDuration>timelapse</IcoDuration> {averageDuration}</Duration>;
  };

  renderContainerKind = () => {
    const { containerKind } = this.props.job;

    return !containerKind ? null : <SimpleBadge color="dark">{containerKind}</SimpleBadge>;
  };

  renderDelay = () => {
    const { delay } = this.props.job;

    return !delay ? null : <Delay>+{delay}</Delay>;
  };

  renderJobKind = () => {
    const { kind } = this.props.job;

    return !kind ? null : <SimpleBadge>{kind}</SimpleBadge>;
  };

  renderNoteSchedule = () => {
    const { noteSchedule } = this.props.job;

    return noteSchedule ? <Instruction>{noteSchedule}</Instruction> : null;
  };

  renderPausedIcon = () => {
    const { paused } = this.props.job;

    return paused ? <IcoPaused>pause_circle_outline</IcoPaused> : null;
  };

  renderDeleteIcon = () => {
    const { deleteIcon, job, onDelete } = this.props;
    const { unitId } = job;

    if (deleteIcon && !unitId) {
      return (
        <IconButton id="cpbr-delete-job" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      );
    }
    return null;
  };

  render() {
    const { onClick } = this.props;

    const {
      addressSimple, area, locationName, status,
    } = this.props.job;

    return (
      <Card status={status}>
        <CardContent>
          <Header>
            <BagdesWrapper>
              {this.renderJobKind()}
              {this.renderContainerKind()}
            </BagdesWrapper>

            <IconsWrapper>
              {this.renderDelay()}
              {this.renderPausedIcon()}
              {this.renderDeleteIcon()}
            </IconsWrapper>
          </Header>

          <div onClick={onClick}>
            <Content>
              <PlaceName>{locationName}</PlaceName>
              <Area>{area}</Area>
              <PlaceAddress>{addressSimple}</PlaceAddress>
            </Content>

            <Footer>
              {this.renderOriginalStartDate()}
              {this.renderNoteSchedule()}
              {this.renderAverageDuration()}
            </Footer>
          </div>
        </CardContent>
      </Card>
    );
  }
}

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
};

export default injectIntl(JobCard);
