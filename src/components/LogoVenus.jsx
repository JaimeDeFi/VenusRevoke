import React from 'react';
import { useColorModeValue, useTheme } from '@chakra-ui/react';

function LogoVenus() {
  const theme = useTheme();
  const fillColor = useColorModeValue(theme.colors.customGray[400], 'white');

  return (
    <div style={{
      width: 'clamp(46.5px, 8vw, 58.2px)'
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 174.6 154.6" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="a">
            <path d="M.2 15.9H175v155H.2Zm0 0" />
          </clipPath>
          <clipPath id="b">
            <path d="M171.8 49 108 159.6a22 22 0 0 1-19 11 22 22 0 0 1-19-11l-11.2-19.4a.2.2 0 0 1 0-.1.2.2 0 0 1 0-.2.2.2 0 0 1 .2 0h.1a18.4 18.4 0 0 0 15.4 5.2 18.4 18.4 0 0 0 7.8-3 18.4 18.4 0 0 0 5.7-6l53.5-92.7a18.4 18.4 0 0 0 2.4-8 18.4 18.4 0 0 0-6.3-15 18.5 18.5 0 0 0-7.4-4 .2.2 0 0 1-.2-.2V16a.2.2 0 0 1 .2 0h22.7a22 22 0 0 1 11 3 22 22 0 0 1 8 8 22 22 0 0 1 3 11c0 3.8-1 7.6-3 11zM96.2 16H74.1a.2.2 0 0 0-.2 0 .2.2 0 0 0 0 .2v.1a.3.3 0 0 0 .2.1 11 11 0 0 1 6.4 6.6 11.1 11.1 0 0 1 .6 4.8 11.2 11.2 0 0 1-1.4 4.5L47.4 88a11.1 11.1 0 0 1-3.3 3.6 11.1 11.1 0 0 1-9.4 1.4 11.1 11.1 0 0 1-4.3-2.3.2.2 0 0 0-.1-.1.2.2 0 0 0-.2 0 .2.2 0 0 0 0 .2.2.2 0 0 0 0 .2l11.3 19.6a14.5 14.5 0 0 0 5.3 5.4 14.5 14.5 0 0 0 14.5 0 14.5 14.5 0 0 0 5.3-5.4l42.3-73a14.5 14.5 0 0 0 0-14.5 14.5 14.5 0 0 0-5.3-5.3 14.6 14.6 0 0 0-7.3-2zm-76.9 0a19.1 19.1 0 0 0-3.7 37.8 19.1 19.1 0 0 0 19.6-8A19.1 19.1 0 0 0 38.4 35a19 19 0 0 0-1.4-7.3 19 19 0 0 0-4.2-6.2 19 19 0 0 0-6.2-4.2 19.2 19.2 0 0 0-7.3-1.4zm0 0" />
          </clipPath>
        </defs>
        <g clipPath="url(#a)" transform="translate(-.2 -16)">
          <g clipPath="url(#b)">
            <path d="M.2 16v154.6h174.6V16Zm0 0" fill={fillColor} />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default LogoVenus;
