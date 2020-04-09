import React from 'react';
import styled from 'styled-components';
import MUITabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const GroupSwitcher = React.memo(({ groups, activeGroup, onGroupChange }) => {
  const handleGroupChange = React.useCallback((_, groupID) => onGroupChange(groupID), [
    onGroupChange,
  ]);

  return (
    <Tabs
      value={activeGroup || false}
      onChange={handleGroupChange}
      variant='scrollable'
      textColor='primary'
      indicatorColor='primary'>
      {groups.map(group => (
        <Tab value={group.id} key={group.id} label={group.label} />
      ))}
    </Tabs>
  );
});

const Tabs = styled(MUITabs)`
  padding: 30px 0;

  & .MuiTabs-flexContainer {
    justify-content: center;
  }
`;

export { GroupSwitcher };
