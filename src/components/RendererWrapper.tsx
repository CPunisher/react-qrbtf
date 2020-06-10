import React from 'react';
import {encodeData} from "../utils/qrcodeHandler";
import QRCode from "../utils/qrcode";
import reactCSS from "reactcss";
import merge from "lodash/merge";

export interface RendererProps {
    qrcode?: QRCode,
    className?: string,
    value?: string,
    styles?: any
};

export type SFC<P = {}> = StyledFunctionComponent<P>;

export interface StyledFunctionComponent<P = {}> extends React.FunctionComponent<P> {
    defaultCSS?: any
};

export const RendererWrapper = <T extends RendererProps>(renderer: SFC<T>) => {
    const Renderer: SFC<T> = (props: T) => {
        let newProps: T = Object.assign({}, props);

        newProps.value = newProps.value || "https://qrbtf.com";
        newProps.qrcode = newProps.qrcode || encodeData({ text: newProps.value, correctLevel: 1, typeNumber: -1 });
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

