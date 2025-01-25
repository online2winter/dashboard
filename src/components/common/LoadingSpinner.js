import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
}
`;

const SpinnerContainer = styled.div`
display: inline-block;
width: ${props => props.size}px;
height: ${props => props.size}px;
`;

const SpinnerCircle = styled.div`
width: 100%;
height: 100%;
border: ${props => Math.max(2, props.size / 8)}px solid #f3f3f3;
border-top: ${props => Math.max(2, props.size / 8)}px solid #3498db;
border-radius: 50%;
animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner = ({ size = 40 }) => {
return (
    <SpinnerContainer size={size}>
    <SpinnerCircle size={size} />
    </SpinnerContainer>
);
};

LoadingSpinner.propTypes = {
size: PropTypes.number
};

export default LoadingSpinner;

