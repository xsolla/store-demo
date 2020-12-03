import React from 'react';
import styled from 'styled-components';
import Colorer from 'color';
import Dotdotdot from 'react-dotdotdot';

import Collapse from '@material-ui/core/Collapse';
import MUICardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const ProductCard = React.memo(
  ({ attributes, image, order, name, value, description, actionButtonContent, onAction, isLoading, purchaseEnabled = true }) => {
    const [isShown, setShown] = React.useState(false);
    const showCard = () => setShown(true);

    const [isHovered, setHovered] = React.useState(false);
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    React.useEffect(() => {
      setTimeout(showCard, order * 100);
    }, []);

    const renderAttributes = (attributes) => {
      if (!attributes.length) {
        return null;
      }

      return (
        <small>
          {attributes.map(({external_id, name, values}) => (
            <p key={external_id}>{name}: {values.map(({value}) => value).join(', ')}</p>
          ))}
        </small>
      );
    }

    return (
      <CardAppear shown={isShown} hovered={isHovered}>
        <Card hovered={isHovered} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <CardImage image={image}/>
          <CardContent>
            <CardTitle>{name}</CardTitle>
            <Collapse in={isHovered} timeout='auto' collapsedHeight='50px'>
              {isHovered ? (
                description
              ) : (
                <Dotdotdot animate clamp={2}>
                  {description}
                </Dotdotdot>
              )}
            </Collapse>
            {renderAttributes(attributes)}
          </CardContent>
          {(onAction || value) && (
            <CardFooter>
              {value && <CardQuantity>{value}</CardQuantity>}
              {onAction && (
                <StyledButton
                  variant='contained'
                  color='secondary'
                  disabled={!purchaseEnabled || isLoading}
                  onClick={onAction}>
                  {isLoading ? <CircularProgress size={24} color='primary'/> : actionButtonContent}
                </StyledButton>
              )}
            </CardFooter>
          )}
        </Card>
      </CardAppear>
    );
  }
);

const CardAppear = styled.div`
  position: relative;
  z-index: ${props => (props.hovered ? 1 : 0)};
  width: ${({ theme }) => theme.shape.cardWidth};
  height: ${({ theme }) => theme.shape.cardWidth};
  transition: transform 350ms ease-out, opacity 150ms ease-out;
  opacity: ${props => (props.shown ? 1 : 0)};
  transform: ${props => (props.shown ? 'none' : 'translateY(20px)')};
`;

const Card = styled.div`
  position: absolute;
  color: ${({ theme }) => theme.palette.text.primary};
  display: flex;
  flex-direction: column;
  width: ${({ theme }) => theme.shape.cardWidth};
  min-height: ${({ theme }) => theme.shape.cardWidth};
  background-color: ${({ theme, hovered }) =>
  hovered ? theme.palette.background.default : 'transparent'};
  box-shadow: ${({ theme, hovered }) => (hovered ? theme.shadows[8] : 'none')};
  transition: ${({ theme }) => theme.transitions.create(['box-shadow', 'background-color'])};
  border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
`;

const CardContent = styled(MUICardContent)`
  min-height: 66px;
  overflow: hidden;
  flex-grow: 0;
  padding-bottom: 0;
  margin-bottom: 8px;
`;

const CardTitle = styled.div`
  color: ${({ theme }) => theme.palette.primary.contrastText};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bolder;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid
    ${({ theme }) =>
  Colorer(theme.palette.text.primary)
    .alpha(0.1)
    .string()};
  padding: 8px 0;
  height: 53px;
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
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: 600;
`;

const StyledButton = styled(Button)`
  &.MuiButton-contained.Mui-disabled {
    color: rgba(0, 0, 0, 0.52);
    background-color: rgb(214, 224, 231, 0.12);
  }
`;

export { ProductCard };
