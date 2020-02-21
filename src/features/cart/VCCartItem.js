import React from 'react';
import styled from 'styled-components';

import { device } from '../../styles/devices';

const VCCartItem = React.memo(({ item }) => {
  return (
    <Body>
      <Image image={item.image_url} />
      <div>
        <Name>{item.name}</Name>
        <div>{item.description}</div>
      </div>
    </Body>
  );
});

const Body = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 1fr;
  color: ${props => props.theme.colorText};
  overflow: hidden;
  height: 130px;

  @media ${device.mobileL} {
    height: 185px;
    grid-template-columns: 0.9fr 1.1fr;
    grid-template-rows: 120px 1fr;
  }
`;

const Image = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const Name = styled.div`
  font-weight: bolder;
  margin-bottom: 5px;
`;

export { VCCartItem };
