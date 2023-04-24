import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Menu from './Menu';
import {get} from "rails-fetch";

const AppBarSC = styled(AppBar)`
  flex: none;
  
  button {
    margin-right: 15px;
  }
`;

const BurgerMenuIcon = styled(MenuIcon)`
  &.icon-color {
    color: ${props => props.theme.app.white};
  }
`;

const Title = styled(Typography)`
  flex: 1;  
  font-size: 1.2rem !important;
  font-weight: 400 !important;
`;

class Header extends Component {
  state = {
    menuOpened: false,
  };

  componentDidMount() {
    this.initIntuit();
  }

  initIntuit = async () => {
    const response = await get('/quickbooks/grant_url.json');
    const grantUrl = await response.json();

    intuit.ipp.anywhere.setup({
      datasources: {
        quickbooks: true,
      },
      grantUrl,
    });
  };

  handleToggleMenu = () => {
    this.setState({
      menuOpened: !this.state.menuOpened,
    });
  };

  renderTitle = () => {
    let title = '';

    const { pathname } = this.props.location;

    switch (true) {
      case /\/customers/.test(pathname): {
        title = <FormattedMessage id="common.title.client" />;
        break;
      }
      case /\/items/.test(pathname): {
        title = <FormattedMessage id="common.title.inventory" />;
        break;
      }
      case /\/jobs/.test(pathname): {
        title = <FormattedMessage id="common.title.jobs" />;
        break;
      }
      case /\/preparations/.test(pathname): {
        title = <FormattedMessage id="common.title.preparation" />;
        break;
      }
      case /\/franchises/.test(pathname): {
        title = <FormattedMessage id="common.title.franchise" />;
        break;
      }
      case /\/differed_transactions/.test(pathname): {
        title = <FormattedMessage id="common.title.depositsFranchises" />;
        break;
      }
      default: {
        title = <FormattedMessage id="tasks_planification" />;
        break;
      }
    }

    return <Title variant="h6" color="inherit">{title}</Title>;
  };

  render() {
    const { menuOpened } = this.state;

    return (
      <AppBarSC position="static" elevation={0}>
        <Toolbar>
          <IconButton aria-label="Menu" onClick={this.handleToggleMenu}>
            <BurgerMenuIcon classes={{ root: 'icon-color' }} />
          </IconButton>

          <Menu opened={menuOpened} toggleMenu={this.handleToggleMenu} />

          {this.renderTitle()}
          <span dangerouslySetInnerHTML={{ __html: '<ipp:connectToIntuit/>' }} />
        </Toolbar>
      </AppBarSC>
    );
  }
}

Header.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(Header);
