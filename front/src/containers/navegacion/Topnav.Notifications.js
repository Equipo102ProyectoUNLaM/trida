import React, { useState, useEffect } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getCollectionOnSnapshotOrderedAndLimited } from 'helpers/Firebase-db';
import moment from 'moment';
import { editDocument } from 'helpers/Firebase-db';

const NotificationItem = ({ leida, contenido, fecha }) => {
  return (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom">
      {!leida && (
        <a className="margin-auto" href="/app/pages/product/details">
          <span className={`log-indicator align-middle border-danger`} />
        </a>
      )}
      <div className="pl-3 pr-2">
        <a href="/app/pages/product/details">
          <p className="font-weight-medium mb-1">{contenido}</p>
          <p className="text-muted mb-0 text-small">
            {moment(fecha.toDate()).fromNow()}
          </p>
        </a>
      </div>
    </div>
  );
};

const TopnavNotifications = ({ user }) => {
  const [notifications, setNotificationsOnSnapshot] = useState([]);
  const [loading, setLoading] = useState(true);

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
        id: docId,
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
    if (element.length != 0) {
      notifications.forEach((element) => {
        if (!element.leida)
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
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
          onClick={onClickDropdown}
          onBlur={onClickDropdown}
        >
          <i className="simple-icon-bell" />
          {notifications.filter((x) => !x.leida).length != 0 && (
            <span className="count">
              {notifications.filter((x) => !x.leida).length}
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
          </PerfectScrollbar>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavNotifications;
