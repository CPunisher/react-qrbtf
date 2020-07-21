import React from 'react';
import {encodeData} from "../utils/qrcodeHandler";
import QRCode from "../utils/qrcode";
import reactCSS from "reactcss";
import merge from "lodash/merge";

export interface RendererProps {
    qrcode?: QRCode,
    className?: string,
    value?: string,
    level?: string,
    styles?: any,
    title?: string,
    titleColor?: string,
    icon?: string,
};

export type SFC<P = {}> = StyledFunctionComponent<P>;

export interface StyledFunctionComponent<P = {}> extends React.FunctionComponent<P> {
    defaultCSS?: any
};

export const RendererWrapper = <T extends RendererProps>(renderer: SFC<T>) => {
    const Renderer: SFC<T> = (props: T) => {
        let newProps: T = Object.assign({}, props);

        newProps.value = newProps.value || "https://qrbtf.com";
        newProps.level = newProps.title || newProps.icon ? "H" : newProps.level || 'M'
        newProps.qrcode = newProps.qrcode || encodeData({ text: newProps.value, correctLevel: newProps.level, typeNumber: -1 });
        newProps.titleColor = newProps.titleColor || "#000000";
        newProps.styles = reactCSS(merge({
            'default': renderer.defaultCSS
        }, {
            'default': props.styles
        }));

        return (
            React.createElement(renderer, newProps)
        );
    }
    return Renderer;
}

export function drawIcon({ qrcode, title, titleColor, icon }: RendererProps) {
    if (!qrcode) return []
    if (!title && !icon) return null;

    const nCount = qrcode.getModuleCount();
    const width = Number((nCount + nCount / 5 * 2) * .3);
    const pos = (nCount - width) / 2;
    const fontSize = nCount / 10;

    const pointList = [
        <rect width={width} height={width} rx="2" ry="2" fill="#FFFFFF" x={pos} y={pos} />
    ];
    if (icon) {
        pointList.push(<image xlinkHref={icon} width={width - 4} x={pos + 2} y={pos + 2} />);
    }

    if(title) {
        const fontY = icon ? pos + width - fontSize * .5 : nCount / 2 - fontSize * .5;
        pointList.push(<text x={nCount / 2} y={fontY} fill={titleColor} style={{ fontSize: fontSize }} textAnchor="middle">{title}</text>)
    }

    return pointList;
}
