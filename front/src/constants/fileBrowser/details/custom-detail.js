import PropTypes from 'prop-types';
import React from 'react';

class CustomDetail extends React.Component {
  /*   static propTypes = {
    file: PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      extension: PropTypes.string.isRequired,
      url: PropTypes.string,
      fullKey: PropTypes.string
    }).isRequired,
    fullKey: PropTypes.string,
    close: PropTypes.func,
  }; */
  constructor(props) {
    super(props);
    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      file: 'mjQtdNYdRKMqZ3aty4NKBh7ZXjG2-00---Presentacion-de-la-materia1.pdf',
      isLoading: true,
      subjectId: id,
    };
  }

  render() {
    let name = this.props.file.key.split('/');
    name = name.length ? name[name.length - 1] : '';

    return (
      <div className="item-detail">
        <h2>Detalle Customizado de la corrección</h2>
        <dl>
          <dt>Key</dt>
          <dd>{this.props.file.key}</dd>
          <dd>{this.props.fullKey}</dd>
          {('props', console.log(this.props))}
          <dt>Name</dt>
          <dd>{name}</dd>
        </dl>
        {/*         <a href="#" onClick={}>
          Probando
        </a>
        <a href="#" onClick={}>
          Close
        </a> */}
      </div>
    );
  }
}

export default CustomDetail;
