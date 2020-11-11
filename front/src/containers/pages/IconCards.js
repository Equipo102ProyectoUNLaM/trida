import React from 'react';
import { Card, CardBody } from 'reactstrap';

const IconCard = ({
  className = 'mb-4',
  icon,
  title,
  value,
  to,
  onClick,
  id,
}) => {
  const onCardClick = () => {
    return onClick(id);
  };
  return (
    <a href={to}>
      <div
        className={`icon-row-item ${className}`}
        onClick={onClick ? onCardClick : null}
      >
        <Card>
          <CardBody className="text-center">
            <i className={icon} />
            <p className="card-text font-weight-semibold mb-0">{title}</p>
            {value && <p className="lead text-center">{value}</p>}
          </CardBody>
        </Card>
      </div>
    </a>
  );
};

export default IconCard;
