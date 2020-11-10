import React from 'react';
import { Card, CardBody } from 'reactstrap';

const IconCard = ({
  className = 'mb-4',
  icon,
  foto,
  title,
  value1,
  value2,
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
            {foto && (
              <img
                className="social-header card-img wh-200 mb-2 padding-1 border-radius-50"
                src={foto}
              />
            )}
            {icon && <i className={icon} />}
            <p className="card-text font-weight-semibold mb-0 truncate">
              {title}
            </p>
            {value1 && (
              <p className="card-text font-weight-semibold mb-0 truncate">
                {value1}
              </p>
            )}
            {value2 && <p className="lead text-center">{value2}</p>}
          </CardBody>
        </Card>
      </div>
    </a>
  );
};

export default IconCard;
