import { mergeConfigs, colorFactory } from '@shopify/polaris-tokens/dist-modern';
import { config } from '@shopify/polaris-tokens/dist-modern/configs/base';

function buildCustomPropertiesNoMemo(themeConfig, tokens) {
  const {
    colors = {},
    colorScheme,
    config: config$1,
    frameOffset = '0px'
  } = themeConfig;
  const mergedConfig = mergeConfigs(config, config$1 || {});
  return customPropertyTransformer({ ...colorFactory(colors, colorScheme, mergedConfig),
    ...tokens,
    frameOffset
  });
}
function buildThemeContext(themeConfig, cssCustomProperties) {
  const {
    logo,
    colors = {},
    colorScheme
  } = themeConfig;
  return {
    logo,
    cssCustomProperties: toString(cssCustomProperties),
    colors,
    colorScheme
  };
}
function toString(obj) {
  if (obj) {
    return Object.entries(obj).map(pair => pair.join(':')).join(';');
  } else {
    return '';
  }
}

function customPropertyTransformer(properties) {
  return Object.entries(properties).reduce((transformed, [key, value]) => ({ ...transformed,
    [toCssCustomPropertySyntax(key)]: value
  }), {});
}

function toCssCustomPropertySyntax(camelCase) {
  return `--p-${camelCase.replace(/([A-Z0-9])/g, '-$1').toLowerCase()}`;
} // eslint-disable-next-line @typescript-eslint/ban-types

function memoize(fnToMemoize) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify([fnToMemoize.name, args]);

    if (cache.get(key) === undefined) {
      cache.set(key, fnToMemoize(...args));
    }

    return cache.get(key);
  };
}

const buildCustomProperties = memoize(buildCustomPropertiesNoMemo);

export { buildCustomProperties, buildCustomPropertiesNoMemo, buildThemeContext, toCssCustomPropertySyntax, toString };
