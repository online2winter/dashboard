import React from 'react';
import PropTypes from 'prop-types';

const styles = {
card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    margin: '8px 0',
},
};

const Card = ({ className, children }) => {
return (
    <div
    style={styles.card}
    className={className}
    >
    {children}
    </div>
);
};

Card.propTypes = {
className: PropTypes.string,
children: PropTypes.node,
};

Card.defaultProps = {
className: '',
};

export default Card;

