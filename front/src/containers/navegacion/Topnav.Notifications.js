import React, { useState, useEffect } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getCollectionOnSnapshot } from 'helpers/Firebase-db';
import moment from 'moment';

const NotificationItem = ({ leida, contenido, fecha }) => {
  return (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom">
      <a href="/app/pages/product/details">
        {/* <img
          src={img}
          alt={title}
          className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle"
        /> */}
      </a>
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
      arrayNotifications.push({
        leida: docData.leida,
        contenido: docData.contenido,
        fecha: docData.fecha,
      });
      console.log(arrayNotifications);
    }
    setNotificationsOnSnapshot(arrayNotifications);
    setLoading(false);
  };

  useEffect(() => {
    getCollectionOnSnapshot(
      `notificaciones/${user}/listado`,
      onNewNotification
    );
  }, []);

  return loading ? (
    <div className="loading" />
  ) : (
    <div className="position-relative d-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
        >
          <i className="simple-icon-bell" />
          <span className="count">3</span>
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3 scroll"
          right
          id="notificationDropdown"
        >
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {console.log('notificaciones', notifications)}
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
