import styled from 'styled-components';

import { device } from '../../../../styles/devices';

const Body = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 1fr;
  color: ${({ theme }) => theme.palette.text.primary};
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

const Content = styled.div`
  padding: 10px;
`;

const Name = styled.div`
  font-weight: bolder;
  margin-bottom: 5px;
`;

const ItemQuantity = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: 600;
`;

const SelectBonus = styled.div`
  font-weight: bolder;
  padding: 10px;
`

export {
  Body,
  Image,
  Content,
  Name,
  ItemQuantity,
  SelectBonus
};