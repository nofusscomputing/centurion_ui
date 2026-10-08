import { useContext, forwardRef, useEffect } from 'react';

import { TabAction, TabsContext, Tooltip } from '@patternfly/react-core';

import { TabProps } from '@patternfly/react-core/src/components/Tabs'

import RhMicronsCloseIcon from '@patternfly/react-icons/dist/esm/icons/rh-microns-close-icon';

import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Tabs/tabs';

import { TabButton } from './TabButton';



const TabBase: React.FunctionComponent<TabProps> = ({
  title,
  eventKey,
  tabContentRef,
  id: childId,
  tabContentId,
  className: childClassName = '',
  ouiaId: childOuiaId,
  isDisabled,
  isAriaDisabled,
  inoperableEvents = ['onClick', 'onKeyPress'],
  href,
  innerRef,
  tooltip,
  closeButtonAriaLabel,
  isCloseDisabled = false,
  actions,
  ...props
}: TabProps) => {
  const preventedEvents = inoperableEvents.reduce(
    (handlers, eventToPrevent) => ({
      ...handlers,
      [eventToPrevent]: (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
      }
    }),
    {}
  );
  const { mountOnEnter, localActiveKey, unmountOnExit, uniqueId, setAccentStyles, handleTabClick, handleTabClose } =
    useContext(TabsContext);
  let ariaControls = tabContentId ? `${tabContentId}` : `pf-tab-section-${eventKey}-${childId || uniqueId}`;
  if ((mountOnEnter || unmountOnExit) && eventKey !== localActiveKey) {
    ariaControls = undefined;
  }
  const isButtonElement = Boolean(!href);
  const getDefaultTabIdx = () => {
    if (isDisabled) {
      return isButtonElement ? null : -1;
    } else if (isAriaDisabled) {
      return null;
    }
  };

  const tabButton = (
    <TabButton
      parentInnerRef={innerRef}
      className={css(
        styles.tabsLink,
        isDisabled && href && styles.modifiers.disabled,
        isAriaDisabled && styles.modifiers.ariaDisabled
      )}
      disabled={isButtonElement ? isDisabled : null}
      aria-disabled={isDisabled || isAriaDisabled}
      tabIndex={getDefaultTabIdx()}
      onClick={(event: any) => handleTabClick(event, eventKey, tabContentRef)}
      {...(isAriaDisabled ? preventedEvents : null)}
      id={`pf-tab-${eventKey}-${childId || uniqueId}`}
      aria-controls={ariaControls}
      tabContentRef={tabContentRef}
      ouiaId={childOuiaId}
      href={href}
      role="tab"
      aria-selected={eventKey === localActiveKey}
      {...props}
    >
      {title}
    </TabButton>
  );

  useEffect(() => {
    setAccentStyles(true);
  }, [title, actions]);

  return (
    <li
      className={css(
        styles.tabsItem,
        eventKey === localActiveKey && styles.modifiers.current,
        (handleTabClose || actions) && styles.modifiers.action,
        (isDisabled || isAriaDisabled) && styles.modifiers.disabled,
        childClassName
      )}
      role="presentation"
    >
      {tooltip ? <Tooltip {...tooltip.props}>{tabButton}</Tooltip> : tabButton}
      {actions && actions}
      {handleTabClose !== undefined && (
        <TabAction
          aria-label={closeButtonAriaLabel || 'Close tab'}
          onClick={(event: any) => handleTabClose(event, eventKey, tabContentRef)}
          isDisabled={isCloseDisabled}
        >
          <RhMicronsCloseIcon />
        </TabAction>
      )}
    </li>
  );
};



/**
 * Custom implementation from @patterfly/react-core v6.6.0
 * 
 * Why?
 * 
 * Currently you can not pass a react-router.Link component to a tab.
 * 
 * @category Component
 * @since 0.15.0
 */
export const Tab = forwardRef((props: TabProps, ref: React.Ref<any>) => <TabBase innerRef={ref} {...props} />);
Tab.displayName = 'Tab';
