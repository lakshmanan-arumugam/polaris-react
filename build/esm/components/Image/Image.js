import React from 'react';

function Image({
  sourceSet,
  source,
  crossOrigin,
  ...rest
}) {
  const finalSourceSet = sourceSet ? sourceSet.map(({
    source: subSource,
    descriptor
  }) => `${subSource} ${descriptor}`).join(',') : null;
  return finalSourceSet ?
  /*#__PURE__*/
  // eslint-disable-next-line jsx-a11y/alt-text
  React.createElement("img", Object.assign({
    src: source,
    srcSet: finalSourceSet,
    crossOrigin: crossOrigin
  }, rest)) :
  /*#__PURE__*/
  // eslint-disable-next-line jsx-a11y/alt-text
  React.createElement("img", Object.assign({
    src: source
  }, rest, {
    crossOrigin: crossOrigin
  }));
}

export { Image };
