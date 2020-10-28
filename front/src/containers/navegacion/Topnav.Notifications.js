import React, { useState, useEffect, Fragment } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getCollectionOnSnapshotOrderedAndLimited } from 'helpers/Firebase-db';
import moment from 'moment';
import { editDocument } from 'helpers/Firebase-db';

const NotificationItem = ({ leida, contenido, fecha, url }) => {
  const [now, setTime] = useState(new Date());

  // const updateTime = () => {
  //   setInterval(() => {
  //     setTime(new Date());
  //   }, 1000);
  // };

  return (
    <Fragment>
      {/* {updateTime()} */}
      {new Date(fecha.toDate()) <= now && (
        <div className="d-flex flex-row mb-3 pb-3 border-bottom">
          {!leida && (
            <a className="margin-auto" href={url}>
              <span className={`log-indicator align-middle border-danger`} />
            </a>
          )}
          <div className="pl-3 pr-2">
            <a href={url}>
              <p className="font-weight-medium mb-1">{contenido}</p>
              <p className="text-muted mb-0 text-small">
                {moment(fecha.toDate()).fromNow()}
              </p>
            </a>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const TopnavNotifications = ({ user }) => {
  const [notifications, setNotificationsOnSnapshot] = useState([]);
  const [loading, setLoading] = useState(true);

  const [now, setTime] = useState(new Date());

  // const updateTime = () => {
  //   setInterval(() => {
  //     setTime(new Date());
  //   }, 1000);
  // };

  const onNewNotification = (documents) => {
    let arrayNotifications = [];
    const { docs } = documents;
    for (const doc of docs) {
      const docData = doc.data();
      const docId = doc.id;
      arrayNotifications.push({
        leida: docData.leida,
        contenido: docData.contenido,
        fecha: docData.fecha,
        url: docData.url,
        id: docId,
        programada: docData.id ? true : false,
      });
    }
    setNotificationsOnSnapshot(arrayNotifications);
    setLoading(false);
  };

  useEffect(() => {
    getCollectionOnSnapshotOrderedAndLimited(
      `notificaciones/${user}/listado`,
      onNewNotification,
      'fecha',
      'desc',
      15
    );
  }, []);

  const onClickDropdown = (event) => {
    const element = document.getElementsByClassName(
      'dropdown-menu-right dropdown show'
    );
    if (element.length !== 0) {
      notifications.forEach((element) => {
        if (
          (!element.leida && !element.programada) ||
          (!element.leida &&
            element.programada &&
            new Date(element.fecha.toDate()) <= new Date())
        )
          editDocument(`notificaciones/${user}/listado`, element.id, {
            leida: true,
          });
      });
    }
  };

  return loading ? (
    <div className="loading" />
  ) : (
    <div className="position-relative d-inline-block">
      {/* {updateTime()} */}
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
          onClick={onClickDropdown}
          onBlur={onClickDropdown}
        >
          <i className="simple-icon-bell" />
          {notifications.filter(
            (x) =>
              (!x.leida && !x.programada) ||
              (!x.leida &&
                x.programada &&
                new Date(x.fecha.toDate()) <= new Date())
          ).length !== 0 && (
            <span className="count">
              {
                notifications.filter(
                  (x) =>
                    (!x.leida && !x.programada) ||
                    (!x.leida &&
                      x.programada &&
                      new Date(x.fecha.toDate()) <= new Date())
                ).length
              }
            </span>
          )}
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3 scroll"
          right
          id="notificationDropdown"
        >
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {notifications &&
              notifications.map((notification, index) => {
                return <NotificationItem key={index} {...notification} />;
              })}
            {!notifications ||
              (notifications.length === 0 && (
                <span>No tenés notificaciones</span>
              ))}
          </PerfectScrollbar>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavNotifications;
