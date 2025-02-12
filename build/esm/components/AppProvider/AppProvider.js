import React, { Component } from 'react';
import 'focus-visible/dist/focus-visible';
import './AppProvider.scss.js';
import { StickyManager } from '../../utilities/sticky-manager/sticky-manager.js';
import { ScrollLockManager } from '../../utilities/scroll-lock-manager/scroll-lock-manager.js';
import { UniqueIdFactory, globalIdGeneratorFactory } from '../../utilities/unique-id/unique-id-factory.js';
import { I18n } from '../../utilities/i18n/I18n.js';
import { FeaturesContext } from '../../utilities/features/context.js';
import { I18nContext } from '../../utilities/i18n/context.js';
import { ScrollLockManagerContext } from '../../utilities/scroll-lock-manager/context.js';
import { StickyManagerContext } from '../../utilities/sticky-manager/context.js';
import { UniqueIdFactoryContext } from '../../utilities/unique-id/context.js';
import { LinkContext } from '../../utilities/link/context.js';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider.js';
import { MediaQueryProvider } from '../MediaQueryProvider/MediaQueryProvider.js';
import { PortalsManager } from '../PortalsManager/PortalsManager.js';
import { FocusManager } from '../FocusManager/FocusManager.js';

class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.stickyManager = void 0;
    this.scrollLockManager = void 0;
    this.uniqueIdFactory = void 0;
    this.stickyManager = new StickyManager();
    this.scrollLockManager = new ScrollLockManager();
    this.uniqueIdFactory = new UniqueIdFactory(globalIdGeneratorFactory);
    const {
      i18n,
      linkComponent
    } = this.props; // eslint-disable-next-line react/state-in-constructor

    this.state = {
      link: linkComponent,
      intl: new I18n(i18n)
    };
  }

  componentDidMount() {
    if (document != null) {
      this.stickyManager.setContainer(document);
    }
  }

  componentDidUpdate({
    i18n: prevI18n,
    linkComponent: prevLinkComponent
  }) {
    const {
      i18n,
      linkComponent
    } = this.props;

    if (i18n === prevI18n && linkComponent === prevLinkComponent) {
      return;
    } // eslint-disable-next-line react/no-did-update-set-state


    this.setState({
      link: linkComponent,
      intl: new I18n(i18n)
    });
  }

  render() {
    const {
      theme = {},
      features = {},
      children
    } = this.props;
    const {
      intl,
      link
    } = this.state;
    return /*#__PURE__*/React.createElement(FeaturesContext.Provider, {
      value: features
    }, /*#__PURE__*/React.createElement(I18nContext.Provider, {
      value: intl
    }, /*#__PURE__*/React.createElement(ScrollLockManagerContext.Provider, {
      value: this.scrollLockManager
    }, /*#__PURE__*/React.createElement(StickyManagerContext.Provider, {
      value: this.stickyManager
    }, /*#__PURE__*/React.createElement(UniqueIdFactoryContext.Provider, {
      value: this.uniqueIdFactory
    }, /*#__PURE__*/React.createElement(LinkContext.Provider, {
      value: link
    }, /*#__PURE__*/React.createElement(ThemeProvider, {
      theme: theme
    }, /*#__PURE__*/React.createElement(MediaQueryProvider, null, /*#__PURE__*/React.createElement(PortalsManager, null, /*#__PURE__*/React.createElement(FocusManager, null, children))))))))));
  }

}

export { AppProvider };
