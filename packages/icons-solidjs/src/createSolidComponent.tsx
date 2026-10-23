import type { JSX } from '@solidjs/web';
import defaultAttributes from './defaultAttributes';
import { omit } from 'solid-js';
import { dynamic } from '@solidjs/web';
import { IconNode, IconProps } from './types';

const createSolidComponent = (
  type: 'outline' | 'filled',
  iconName: string,
  iconNamePascal: string,
  iconNode: IconNode,
) => {
  // An icon's shapes never change: each tag is resolved once, for every instance.
  const shapes = iconNode.map(([tag, attrs]) => [dynamic(() => tag, { static: true }), attrs] as const);

  const Component = (props: IconProps): JSX.Element => {
    // Solid 2: `omit` is the rest half of `splitProps`; the local props are read from `props`.
    const rest = omit(props, 'color', 'size', 'stroke', 'strokeWidth', 'title', 'children', 'class');
    const attributes = defaultAttributes[type];
    const strokeValue = () => props.stroke ?? props.strokeWidth;

    return (
      <svg
        {...attributes}
        {...rest}
        width={props.size != null ? props.size : attributes.width}
        height={props.size != null ? props.size : attributes.height}
        class={`tabler-icon tabler-icon-${iconName}${props.class ? ` ${props.class}` : ''}`}
        {...(type === 'filled'
          ? {
              fill: props.color != null ? props.color : 'currentColor',
            }
          : {
              stroke: props.color != null ? props.color : 'currentColor',
              'stroke-width': strokeValue() != null ? strokeValue() : attributes['stroke-width'],
            })}
      >
        {props.title != null && <title>{props.title}</title>}
        {shapes.map(([Shape, attrs]) => (
          <Shape {...attrs} />
        ))}
        {props.children}
      </svg>
    );
  };

  Component.displayName = `${iconNamePascal}`;
  return Component;
};

export default createSolidComponent;
