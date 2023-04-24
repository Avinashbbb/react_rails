import { Drawer, Divider as MuiDivider, ListItemText, List as MuiList, ListItem as MuiListItem } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountBalance';
import PollIcon from '@material-ui/icons/Poll';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ContactsIcon from '@material-ui/icons/Contacts';
import DashboardIcon from '@material-ui/icons/Dashboard';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PeopleIcon from '@material-ui/icons/People';
import PowerSettingIcon from '@material-ui/icons/PowerSettingsNew';
import SalesIcon from '@material-ui/icons/BusinessCenter';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withFranchises } from 'optigo-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import LogoOptigoSvg from '../../images/logo_optigo_officiel.svg';
import LogoParfaitMenage from '../../images/logo-parfait-menage.svg';
import withUser from '../../containers/withUser';
import ModalPpaFileNumber from '../ModalPpaFileNumber';

const Wrapper = styled.div`
  height: 100vh; 
`;

const Divider = styled(MuiDivider)`
  && {
    margin: 15px 0px;
  }
`;

const ExternalLinkIcon = styled(OpenInNewIcon)`
  &.icon-color {
    position: absolute;
    width: 0.8rem;
    margin-left: 0.5rem;
    margin-top: -0.2rem;
    color: ${props => props.theme.app.fadedIconColor};
  }
`;

const List = styled(MuiList)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 590px;
`;

const ListItem = styled(MuiListItem)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    svg{
      margin-right: 0;
    }
  }
`;

const Logo = styled(LogoParfaitMenage)`
  width: 72px;
  height: 17px;
  
  g {
    fill: ${props => props.theme.app.fadedIconColor};
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  margin: 30px 0;
`;

const LogoOptigo = styled(LogoOptigoSvg)`
  width: 100px;
`;


class Menu extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialState = {
    ppaFileNumberModalOpened: false,
  };

  state = {
    ...this.initialState,
  };

  handleRefreshAfterModify = () => {
    this.handleTogglePpaFileNumberModal(false);
  };

  handleTogglePpaFileNumberModal = (value) => {
    this.setState({ ppaFileNumberModalOpened: value });
  };

  handleSignOut = async () => {
    const { signOut } = this.props;

    signOut();
  };

  renderPpaLink = () => {
    const { franchises, franchisesLoading, franchisesRootAccess } = this.props;

    if (franchisesLoading || typeof franchises === 'undefined' || (franchises && franchises.length === 0)) {
      return null;
    }

    if (franchisesRootAccess) {
      return (
        <ModalPpaFileNumber
          refreshList={this.handleRefreshAfterModify}
          fileToGenerate="ppa"
          fileNumber={null}
          handleTogglePpaFileNumberModal={this.handleTogglePpaFileNumberModal}
        />
      );
    }

    return null;
  }

  renderDepositsFranchisesLink = () => {
    const { franchises, franchisesLoading, franchisesRootAccess } = this.props;
    if (franchisesLoading || typeof franchises === 'undefined' || (franchises && franchises.length === 0)) {
      return null;
    }

    if (franchisesRootAccess) {
      return (
        <ListItem component="a" href="/differed_transactions_credit" button>
          <WalletIcon classes={{ root: 'menu-icon-color' }} />
          <ListItemText className="adjust-padd-right" primary={<FormattedMessage id="common.title.depositsFranchises" />} />
        </ListItem>
      );
    }

    return null;
  }

  renderReportsLink = () => {
    const { franchises, franchisesLoading, franchisesRootAccess } = this.props;

    if (franchisesLoading || typeof franchises === 'undefined' || (franchises && franchises.length === 0)) {
      return null;
    }

    if (franchisesRootAccess) {
      return (
        <ListItem component="a" href="/reports" target="_blank" button>
          <PollIcon classes={{ root: 'menu-icon-color' }} />
          <ListItemText className="adjust-padd-right" primary={<FormattedMessage id="common.title.reports" />} />
        </ListItem>
      );
    }

    return null;
  }

  render() {
    const { opened, toggleMenu } = this.props;
    const { ppaFileNumberModalOpened } = this.state;

    return (
      <Drawer open={opened} onClose={toggleMenu}>
        <Wrapper
          tabIndex={0}
          role="button"
          onKeyDown={ppaFileNumberModalOpened ? '' : toggleMenu}
        >
          <List component="nav">
            <ListItem component={Link} to="/" button>
              <LogoOptigo />
            </ListItem>

            <Divider />

            <ListItem component={Link} to="/" button>
              <DashboardIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText primary={<FormattedMessage id="common.title.assignation" />} />
            </ListItem>

            <ListItem component={Link} to="/calendar" button>
              <DashboardIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText primary={<FormattedMessage id="common.title.calendar" />} />
            </ListItem>

            <ListItem component={Link} to="/preparations" button>
              <AssignmentIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText primary={<FormattedMessage id="common.title.preparation" />} />
            </ListItem>

            <ListItem component={Link} to="/customers" button>
              <PeopleIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText primary={<FormattedMessage id="common.title.client" />} />
            </ListItem>

            <ListItem component={Link} to="/franchises" button>
              <ContactsIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText primary={<FormattedMessage id="common.title.franchise" />} />
            </ListItem>

            { this.renderReportsLink() }

            { this.renderPpaLink() }

            { this.renderDepositsFranchisesLink() }

            <Divider />

            <ListItem component="a" href="https://quickbooks.intuit.com/" target="_blank" button>
              <AccountIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText className="adjust-padd-right" primary={<span><FormattedMessage id="common.title.quickbooks" /><ExternalLinkIcon classes={{ root: 'icon-color' }} /></span>} />
            </ListItem>

            <ListItem component="a" href="https://crm.parfaitmenage.optigo.ca" target="_blank" button>
              <SalesIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText className="adjust-padd-right" primary={<span><FormattedMessage id="common.title.sales" /> <ExternalLinkIcon classes={{ root: 'icon-color' }} /></span>} />
            </ListItem>

            <ListItem button onClick={this.handleSignOut}>
              <PowerSettingIcon classes={{ root: 'menu-icon-color' }} />
              <ListItemText primary={<FormattedMessage id="logout" />} />
            </ListItem>

            <LogoWrapper>
              <Logo />
            </LogoWrapper>
          </List>
        </Wrapper>
      </Drawer>
    );
  }
}

Menu.defaultProps = {
  opened: false,
};

Menu.propTypes = {
  franchises: PropTypes.arrayOf(PropTypes.object).isRequired,
  franchisesLoading: PropTypes.bool.isRequired,
  franchisesRootAccess: PropTypes.bool.isRequired,
  opened: PropTypes.bool,
  signOut: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default withFranchises(withUser(Menu));
