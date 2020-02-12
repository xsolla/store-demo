import React from 'react';
import styled from 'styled-components';
import Colorer from 'color';
import Dotdotdot from 'react-dotdotdot'

import Collapse from '@material-ui/core/Collapse';
import MUICardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const ProductCard = React.memo(({
  image,
  order,
  name,
  value,
  description,
  actionButtonContent,
  onAction,
}) => {
  const [isShown, setShown] = React.useState(false);
  const showCard = () => setShown(true);

  const [isHovered, setHovered] = React.useState(false);
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  React.useEffect(() => {
    setTimeout(showCard, order * 100);
  }, []);

  return (
    <CardAppear shown={isShown} hovered={isHovered}>
      <Card
        hovered={isHovered}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardImage image={image}/>
        <CardContent>
          <CardTitle>{name}</CardTitle>
          <Collapse in={isHovered} timeout="auto" collapsedHeight="50px">
            {isHovered
              ? description
              : (
              <Dotdotdot animate clamp={2}>
                {description}
              </Dotdotdot>
            )}
          </Collapse>
        </CardContent>
        <CardFooter>
          <CardQuantity>
            {value}
          </CardQuantity>
          {onAction && <Button
            variant="contained"
            onClick={onAction}
          >
            {actionButtonContent}
          </Button>}
        </CardFooter>
      </Card>
    </CardAppear>
  );
});

const CardAppear = styled.div`
  position: relative;
  z-index: ${props => props.hovered ? 1 : 0};
  width: ${props => props.theme.cardWidth};
  height: ${props => props.theme.cardWidth};
  transition: transform 350ms ease-out, opacity 150ms ease-out;
  opacity: ${props => props.shown ? 1 : 0};
  transform: ${props => props.shown ? 'none' : 'translateY(20px)'};;
`;

const Card = styled.div`
  position: absolute;
  color: ${props => props.theme.colorText};
  display: flex;
  flex-direction: column;
  width: ${props => props.theme.cardWidth};
  min-height: ${props => props.theme.cardWidth};
  background-color: ${props => props.hovered ? props.theme.colorBg : 'transparent'};
  box-shadow: ${props => props.hovered ? props.theme.boxShadow : 'none'};
  transition: box-shadow, background-color ${props => props.theme.transitionStyle};
  border-radius: ${props => `${props.theme.borderRadius}px`};
`;

const CardContent = styled(MUICardContent)`
  min-height: 66px;
  overflow: hidden;
  flex-grow: 0;
  padding-bottom: 0;
  margin-bottom: 8px;
`;

const CardTitle = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bolder;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${props => Colorer(props.theme.colorText).alpha(0.1).string()};
  padding: 8px 0;
  margin: 0px 16px 0 16px;
`;

const CardImage = styled.div`
  display: block;
  margin-top: 8px;
  height: 120px;
  flex-shrink: 1;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const CardQuantity = styled.div`
  flex-grow: 1;
  color: ${props => props.theme.colorAccent};
  font-weight: 600;
`;

export { ProductCard };
