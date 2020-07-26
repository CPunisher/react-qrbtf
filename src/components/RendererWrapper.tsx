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
    titleSize?: number,
    titleColor?: string,
    titleAlign?: string,
    icon?: string,
    iconScale?: number,
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

export function drawIcon({ qrcode, title, titleSize, titleColor, titleAlign, icon, iconScale = .33, styles }: RendererProps) {
    if (!qrcode) return []
    if (!title && !icon) return null;

    const nCount = qrcode.getModuleCount();
    const { fontSize, color, verticalAlign, ...titleStyle } = styles.title || {};
    const titleVerticalAlign = titleAlign || verticalAlign || (icon ? "bottom" : "middle");

    iconScale = iconScale > .33 ? .33 : iconScale;
    const iconSize = Number(nCount * iconScale);
    const iconXY = (nCount - iconSize) / 2;

    const pointList = [];
    if (icon || titleVerticalAlign === "middle") {
        pointList.push(<rect width={iconSize} height={iconSize} rx="2" ry="2" fill="#FFFFFF" x={iconXY} y={iconXY} />);
    }

    if (icon) {
        pointList.push(<image xlinkHref={icon} width={iconSize - 2} x={iconXY + 1} y={iconXY + 1} />);
    }

    if (title) {
        const svgWidth = styles.svg && styles.svg.width ? styles.svg.width.replace("px", "") : 300;
        const titleFontSize = Number(nCount + nCount / 5 * 2) * (titleSize || fontSize || 12) / svgWidth;
        const titleFontColor = titleColor || color || "#000000";

        const fontY = titleVerticalAlign === "middle" 
            ? (icon ? (iconXY + iconSize) : (nCount / 2 + titleFontSize * .5))
            : Number(nCount + nCount / 5) - titleFontSize * .5;

        pointList.push(<text x={nCount / 2} y={fontY} fill={titleFontColor} style={{ ...titleStyle, fontSize: titleFontSize }} textAnchor="middle">{title}</text>)
    }

    return pointList;
}
