import React, { useMemo, useState } from 'react';
import { getTypeTable, QRPointType } from '../utils/qrcodeHandler';
import { RendererWrapper, RendererProps, SFC } from './RendererWrapper';
import QRCode from "../utils/qrcode";
import { gamma } from "../utils/helper";

enum Type {
    None = 'none',
    White = 'white',
    Bw = 'bw'
}

interface QRResImageProps extends RendererProps {
    image?: string,
    contrast?: number,
    exposure?: number,
    alignType?: Type | string,
    timingType?: Type | string,
    otherColor?: string,
    posColor?: string
}

const QRResImage: SFC<QRResImageProps> = (props) => {
    const { qrcode, className, styles, otherColor } = props;

    const [gpl, setGPL] = useState<Array<JSX.Element>>([]);
    useMemo(() => {
        getGrayPointList(props, qrcode!.getModuleCount(), "#S-black", "#S-white").then(res => setGPL(res));
    }, [setGPL, props, qrcode])

    return (
        <svg className={className} style={styles.svg} width="100%" height="100%" viewBox={getViewBox(qrcode)} fill="white"
            xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <rect id="B-black" fill={otherColor} width={3.08} height={3.08} />
                <rect id="B-white" fill="white" width={3.08} height={3.08} />
                <rect id="S-black" fill={otherColor} width={1.02} height={1.02} />
                <rect id="S-white" fill="white" width={1.02} height={1.02} />
                <rect id="B" width={3.08} height={3.08} />
                <rect id="S" width={1.02} height={1.02} />
            </defs>
            {gpl.concat(listPoints(props))}
        </svg>
    );
}

function getGrayPointList({ image, contrast, exposure }: QRResImageProps, size: number, black: string, white: string) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = document.createElement('img');
    let gpl: Array<JSX.Element> = [];
    canvas.style.imageRendering = 'pixelated';
    size *= 3;

    img.src = image!;
    /**
     * 使用 crossOrigin 属性可以让 canvas 支持绘制非当前域名下的图片，比如 CDN 上的图片资源
     * ios 10.2 版本对本地图片资源不允许使用 crossOrigin 属性，因此需要使用以下兼容代码
     */
    if (image && /^http(s)?:\/\//.test(image)) img.crossOrigin = 'anonymous'
    contrast = contrast! / 100;
    exposure = exposure! / 100;
    return new Promise<typeof gpl>(resolve => {
        img.onload = () => {
            if (ctx) {
                canvas.width = size;
                canvas.height = size;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 0, 0, size, size);
                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        let imageData = ctx.getImageData(x, y, 1, 1);
                        let data = imageData.data;
                        let gray = gamma(data[0], data[1], data[2]);

                        if (Math.random() > ((gray / 255) + exposure! - 0.5) * (contrast! + 1) + 0.5 && (x % 3 !== 1 || y % 3 !== 1))
                            gpl.push(<use key={"g_" + x + "_" + y} x={x} y={y} xlinkHref={black} />);
                    }
                }
                resolve(gpl);
            }
        }
    })
}

function getViewBox(qrcode: QRCode | undefined) {
    if (!qrcode) return '0 0 0 0';

    const nCount = qrcode.getModuleCount() * 3;
    return String(-nCount / 5) + ' ' + String(-nCount / 5) + ' ' + String(nCount + nCount / 5 * 2) + ' ' + String(nCount + nCount / 5 * 2);
}

function listPoints({ qrcode, alignType, timingType, posColor }: QRResImageProps) {
    if (!qrcode) return []

    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = new Array(nCount);
    alignType = alignType!;
    timingType = timingType!;
    posColor = posColor!;

    let id = 0;
    for (let x = 0; x < nCount; x++) {
        for (let y = 0; y < nCount; y++) {
            const posX = 3 * x, posY = 3 * y;
            if (typeTable[x][y] === QRPointType.ALIGN_CENTER || typeTable[x][y] === QRPointType.ALIGN_OTHER) {
                if (qrcode.isDark(x, y)) {
                    if (alignType === Type.Bw) {
                        pointList.push(<use key={id++} xlinkHref="#B-black" x={posX - 0.03} y={posY - 0.03} />)
                    } else {
                        pointList.push(<use key={id++} xlinkHref="#S-black" x={posX + 1 - 0.01} y={posY + 1 - 0.01} />)
                    }
                } else {
                    if (alignType === Type.None) {
                        pointList.push(<use key={id++} xlinkHref="#S-white" x={posX + 1} y={posY + 1} />)
                    } else {
                        pointList.push(<use key={id++} xlinkHref="#B-white" x={posX - 0.03} y={posY - 0.03} />)
                    }
                }
            } else if (typeTable[x][y] === QRPointType.TIMING) {
                if (qrcode.isDark(x, y)) {
                    if (timingType === Type.Bw) {
                        pointList.push(<use key={id++} xlinkHref="#B-black" x={posX - 0.03} y={posY - 0.03} />)
                    } else {
                        pointList.push(<use key={id++} xlinkHref="#S-black" x={posX + 1} y={posY + 1} />)
                    }
                } else {
                    if (timingType === Type.None) {
                        pointList.push(<use key={id++} xlinkHref="#S-white" x={posX + 1} y={posY + 1} />)
                    } else {
                        pointList.push(<use key={id++} xlinkHref="#B-white" x={posX - 0.03} y={posY - 0.03} />)
                    }
                }
            } else if (typeTable[x][y] === QRPointType.POS_CENTER) {
                if (qrcode.isDark(x, y)) {
                    pointList.push(<use key={id++} fill={posColor} xlinkHref="#B" x={posX - 0.03} y={posY - 0.03} />)
                }
            } else if (typeTable[x][y] === QRPointType.POS_OTHER) {
                if (qrcode.isDark(x, y)) {
                    pointList.push(<use key={id++} fill={posColor} xlinkHref="#B" x={posX - 0.03} y={posY - 0.03} />)
                } else {
                    pointList.push(<use key={id++} xlinkHref="#B-white" x={posX - 0.03} y={posY - 0.03} />)
                }
            } else {
                if (qrcode.isDark(x, y)) {
                    pointList.push(<use key={id++} xlinkHref="#S-black" x={posX + 1} y={posY + 1} />)
                }
            }
        }
    }

    return pointList;
}

QRResImage.defaultCSS = {
    svg: {
    }
}

QRResImage.defaultProps = {
    image: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    contrast: 0,
    exposure: 0,
    alignType: Type.None,
    timingType: Type.None,
    otherColor: "#000000",
    posColor: "#000000"
}

export default RendererWrapper(QRResImage);
