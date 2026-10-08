// import { TabButtonProps } from '@patternfly/react-core/src/components/Tabs/TabButton';
import { getOUIAProps, OUIAProps } from '@patternfly/react-core';
// import { getOUIAProps } from '@patternfly/react-core/src/helpers'
import { Link } from 'react-router';



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
export interface TabButtonProps extends Omit<React.HTMLProps<HTMLAnchorElement | HTMLButtonElement>, 'ref'>, OUIAProps {
  /** content rendered inside the Tab content area. */
  children?: React.ReactNode;
  /** additional classes added to the Tab */
  className?: string;
  /** URL associated with the Tab. A Tab with an href will render as an <a> instead of a <button>. A Tab inside a <Tabs component="nav"> should have an href. */
  href?: string;
  /** child reference for case in which a TabContent section is defined outside of a Tabs component */
  tabContentRef?: React.Ref<any>;
  /** Parents' innerRef passed down for properly displaying Tooltips */
  parentInnerRef?: React.Ref<any>;
}



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
export const TabButton: React.FunctionComponent<TabButtonProps> = ({
  children,
  tabContentRef,
  ouiaId,
  parentInnerRef,
  ouiaSafe,
  ...props
}: TabButtonProps) => {

  const Component = (props.href ? Link : 'button') as any;

  const { href, ...cleanProps} = props

  return (
    <Component
      {...(!props.href && { type: 'button' })}
      ref = {parentInnerRef}
      {...getOUIAProps(TabButton.displayName, ouiaId, ouiaSafe)}
      {...cleanProps}
      to = {href}
    >
      {children}
    </Component>
  );
};
TabButton.displayName = 'TabButton';
