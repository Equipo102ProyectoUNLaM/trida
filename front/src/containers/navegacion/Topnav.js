import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { injectIntl } from 'react-intl';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
  cleanSeleccionCurso,
} from 'redux/actions';

import {
  menuHiddenBreakpoint,
  searchPath,
  isDarkSwitchActive,
} from 'constants/defaultValues';

import { MobileMenuIcon, MenuIcon } from 'components/svg';
import TopnavDarkSwitch from './Topnav.DarkSwitch';
import TopnavNotifications from './Topnav.Notifications';
import ModalContacto from 'containers/pages/ModalContacto';

import { getDirection, setDirection } from '../../helpers/Utils';
const publicUrl = process.env.PUBLIC_URL;
const imagenDefaultUsuario = `${publicUrl}/assets/img/defaultUser.png`;

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInFullScreen: false,
      searchKeyword: '',
      modalContactoOpen: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user && !this.props.user) {
      this.props.history.push('/user/login');
    }
  }

  handleChangeLocale = (locale, direction) => {
    this.props.changeLocale(locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  isInFullScreen = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };
  handleSearchIconClick = (e) => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target;
      if (!e.target.classList.contains('search')) {
        if (e.target.parentElement.classList.contains('search')) {
          elem = e.target.parentElement;
        } else if (
          e.target.parentElement.parentElement.classList.contains('search')
        ) {
          elem = e.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains('mobile-view')) {
        this.search();
        elem.classList.remove('mobile-view');
        this.removeEventsSearch();
      } else {
        elem.classList.add('mobile-view');
        this.addEventsSearch();
      }
    } else {
      this.search();
    }
  };
  addEventsSearch = () => {
    document.addEventListener('click', this.handleDocumentClickSearch, true);
  };
  removeEventsSearch = () => {
    document.removeEventListener('click', this.handleDocumentClickSearch, true);
  };

  handleDocumentClickSearch = (e) => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('navbar') ||
        e.target.classList.contains('simple-icon-magnifier'))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains('simple-icon-magnifier')) {
        this.search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains('search')
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector('.mobile-view');
      if (input && input.classList) input.classList.remove('mobile-view');
      this.removeEventsSearch();
      this.setState({
        searchKeyword: '',
      });
    }
  };
  handleSearchInputChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
  };
  handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  search = () => {
    this.props.history.push(searchPath + '/' + this.state.searchKeyword);
    this.setState({
      searchKeyword: '',
    });
  };

  goHome = () => {
    this.props.history.push('app/home');
  };

  toggleFullScreen = () => {
    const isInFullScreen = this.isInFullScreen();

    var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }

    this.setState({
      isInFullScreen: !isInFullScreen,
    });
  };

  handleLogout = () => {
    this.props.logoutUser();
    this.props.cleanSeleccionCurso();
  };

  menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      var event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);
    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    );
  };
  mobileMenuButtonClick = (e, containerClassnames) => {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  };

  toggleModalContacto = () => {
    this.setState({
      modalContactoOpen: !this.state.modalContactoOpen,
    });
  };

  render() {
    const {
      containerClassnames,
      menuClickCount,
      foto,
      nombre,
      apellido,
    } = this.props;
    const { modalContactoOpen } = this.state;
    return (
      <nav className="navbar fixed-top">
        <div className="d-flex align-items-center navbar-left">
          <NavLink
            to="#"
            location={{}}
            className="menu-button d-none d-md-block"
            onClick={(e) =>
              this.menuButtonClick(e, menuClickCount, containerClassnames)
            }
          >
            <MenuIcon />
          </NavLink>
          <NavLink
            to="#"
            location={{}}
            className="menu-button-mobile d-xs-block d-sm-block d-md-none"
            onClick={(e) => this.mobileMenuButtonClick(e, containerClassnames)}
          >
            <MobileMenuIcon />
          </NavLink>
          <div className="d-inline-block breadcrumb-course">
            <Breadcrumb className="nomargin">
              <BreadcrumbItem>
                <a href="/seleccion-curso/institution">
                  {this.props.institution.name}
                </a>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <a
                  href={`/seleccion-curso/course/${this.props.institution.id}`}
                >
                  {this.props.course.name}
                </a>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                <span>{this.props.subject.name}</span>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>

        <a className="navbar-logo" href="/app/home">
          <span className="logo d-none d-xs-block" />
          <span className="logo-mobile d-block d-xs-none" />
        </a>
        <div className="navbar-right">
          {isDarkSwitchActive && !isMobile && <TopnavDarkSwitch />}

          <div className="header-icons d-inline-block align-middle">
            {/* <TopnavEasyAccess /> */}
            <NavLink
              className="header-icon glyph-icon simple-icon-home ml-1"
              to="/app/home"
            />
            <TopnavNotifications
              user={this.props.user}
              subject={this.props.subject.id}
            />
            <button
              className="header-icon btn btn-empty d-none d-sm-inline-block"
              type="button"
              id="fullScreenButton"
              onClick={this.toggleFullScreen}
            >
              {this.state.isInFullScreen ? (
                <i className="simple-icon-size-actual d-block" />
              ) : (
                <i className="simple-icon-size-fullscreen d-block" />
              )}
            </button>
          </div>
          <div className="user d-inline-block">
            <UncontrolledDropdown className="dropdown-menu-user">
              <DropdownToggle className="p-0" color="empty">
                <span className="name mr-1">{`${nombre} ${apellido}`}</span>
              </DropdownToggle>
              <DropdownToggle className="p-0" color="empty">
                {foto ? (
                  <span>
                    <img src={foto} alt="foto-usuario" />
                  </span>
                ) : (
                  <span>
                    <img
                      src={imagenDefaultUsuario}
                      alt="foto-default-usuario"
                    />
                  </span>
                )}
              </DropdownToggle>
              <DropdownMenu className="mt-3" right>
                <DropdownItem
                  onClick={() => this.props.history.push('/app/cuenta')}
                >
                  Mi Cuenta
                </DropdownItem>
                <DropdownItem divider />
                {isMobile && (
                  <>
                    <DropdownItem
                      onClick={() => this.props.history.push('/app/ayuda')}
                    >
                      Ayuda
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.toggleModalContacto}>
                      Contacto
                    </DropdownItem>
                    <DropdownItem divider />
                    <div className="dropdown-item">
                      <TopnavDarkSwitch />
                    </div>
                    <DropdownItem divider />
                  </>
                )}
                <DropdownItem onClick={() => this.handleLogout()}>
                  Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          {modalContactoOpen && (
            <ModalContacto
              isOpen={modalContactoOpen}
              toggle={this.toggleModalContacto}
            />
          )}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ menu, settings, authUser, seleccionCurso }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  const { user, userData } = authUser;
  const { nombre, apellido, foto } = userData;
  const { institution, course, subject } = seleccionCurso;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    user,
    nombre,
    apellido,
    foto,
    institution,
    course,
    subject,
  };
};

export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnames,
    clickOnMobileMenu,
    logoutUser,
    cleanSeleccionCurso,
    changeLocale,
  })(TopNav)
);
