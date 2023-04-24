import { Typography } from '@material-ui/core';
import { withInterruption } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import FormGroupWrapper from './ui/FormGroupWrapper';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';

const Wrapper = styled.div`
  padding: 5px 25px 25px 25px;
`;

const ContentWrapper = styled.div`
  margin: 20px 0;
`;

const Photo = styled.img`
  display: inherit;
  width: 100%;
  height: auto;
  max-width: 640px;
  margin: 0 auto;
`;

const PhotoWrapper = styled.div`
  background-color: #f3f3f3;
`;

class Interruption extends PureComponent {
  componentDidMount() {
    this.fetchInterruption();
  }

  fetchInterruption = () => {
    const { fetchJobInterruption, match } = this.props;

    fetchJobInterruption(match.params.jobId);
  };

  renderInterruption = () => {
    const { interruption } = this.props;
    const {
      id, comment, kind, photo, reason,
    } = interruption;

    if (!id) {
      return null;
    }

    return (
      <Wrapper>
        <Typography variant="h6">
          <FormattedMessage id={`interruptions.${kind}`} />
        </Typography>

        <ContentWrapper>
          <FormGroupWrapper>
            <Typography variante="body1" color="textSecondary">Raison</Typography>
            <Typography variant="body1">{reason}</Typography>
          </FormGroupWrapper>

          <FormGroupWrapper>
            <Typography variante="body1" color="textSecondary">Commentaire du technicien</Typography>
            <Typography variant="body1">{comment}</Typography>
          </FormGroupWrapper>
        </ContentWrapper>

        <PhotoWrapper>
          <Photo src={photo} />
        </PhotoWrapper>
      </Wrapper>
    );
  };

  render() {
    return (
      <PageContainer>
        <PaperWrapper>
          {this.renderInterruption()}
        </PaperWrapper>
      </PageContainer>
    );
  }
}

Interruption.propTypes = {
  fetchJobInterruption: PropTypes.func.isRequired,
  interruption: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};


export default withInterruption(Interruption);
