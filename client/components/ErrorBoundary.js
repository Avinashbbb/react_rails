import React, {PureComponent} from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
  flex: 1;
  width: 100%;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  color: red;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 2.25rem;
  margin-bottom: 0.5rem;
`;

class ErrorBoundary extends PureComponent {

  render() {
    const {hasError} = this.props;

    if (hasError) {
      return (
        <Wrapper>
          <Title>Oups, une erreur s'est produite !</Title>
            Essayez de rafraîchir la page.<br />Si l'erreur se reproduit, contactez le support technique.
        </Wrapper>
      )
    }
    return this.props.children;
  }
}

export default ErrorBoundary;