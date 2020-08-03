import React from 'react';
import {rand, defaultViewBox} from '../utils/helper';
import { getTypeTable, QRPointType } from '../utils/qrcodeHandler';
import {RendererWrapper, RendererProps, SFC} from './RendererWrapper';

enum Type {
    Rect = 'rect',
    Round = 'round',
}

enum PosType {
    Rect = 'rect',
    Round = 'round',
    Planet = 'planet',
}

interface QRImageProps extends RendererProps {
    image?: string,
    type?: Type | string,
    size?: number,
    opacity?: number,
    darkColor?: string,
    lightColor?: string,
    posType?: PosType | string,
    posColor?: string,
}

const QRImage: SFC<QRImageProps> = (props) => {
    const { qrcode, className, styles } = props;
    return (
        <svg className={className} style={styles.svg} width="100%" height="100%" viewBox={defaultViewBox(qrcode)} fill="white"
             xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            {listPoints(props)}
        </svg>
    );
}


function listPoints({ qrcode, image, type, size, opacity, darkColor, lightColor, posType, posColor }: QRImageProps) {
    if (!qrcode) return []

    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = new Array(nCount);

    image = image!;
    type = type!;
    size = size! / 100 / 3;
    opacity = opacity! / 100;
    darkColor = darkColor!;
    lightColor = lightColor!;
    posType = posType!;
    posColor = posColor;
    let id = 0;

    const vw = [3, -3];
    const vh = [3, -3];

    if (size <= 0) size = 1.0

    pointList.push(<image key={id++} x="0" y="0" width={nCount} height={nCount} xlinkHref={image}/>);

    for (let x = 0; x < nCount; x++) {
        for (let y = 0; y < nCount; y++) {

            if (typeTable[x][y] == QRPointType.ALIGN_CENTER || typeTable[x][y] == QRPointType.ALIGN_OTHER || typeTable[x][y] == QRPointType.TIMING) {
                if (qrcode.isDark(x, y)) {
                    if (type == Type.Rect)
                        pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={darkColor} x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                    else if (type == Type.Round)
                        pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={darkColor} cx={x + 0.5} cy={y + 0.5}/>)
                } else {
                    if (type == Type.Rect)
                        pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={lightColor} x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                    else if (type == Type.Round)
                        pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={lightColor} cx={x + 0.5} cy={y + 0.5}/>)
                }
            }
            else if (typeTable[x][y] == QRPointType.POS_CENTER) {
                if (qrcode.isDark(x, y)) {
                    if (posType == PosType.Rect) {
                        pointList.push(<rect width={1} height={1} key={id++} fill={posColor} x={x} y={y}/>);
                    } else if (posType == PosType.Round) {
                        pointList.push(<circle key={id++} fill="white" cx={x + 0.5} cy={y + 0.5} r={5} />)
                        pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
                        pointList.push(<circle key={id++} fill="none" strokeWidth="1" stroke={posColor}  cx={x + 0.5} cy={y + 0.5} r={3} />)
                    } else if (posType == PosType.Planet) {
                        pointList.push(<circle key={id++} fill="white" cx={x + 0.5} cy={y + 0.5} r={5} />)
                        pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
                        pointList.push(<circle key={id++} fill="none" strokeWidth="0.15" strokeDasharray="0.5,0.5" stroke={posColor}  cx={x + 0.5} cy={y + 0.5} r={3} />)
                        for (let w = 0; w < vw.length; w++) {
                            pointList.push(<circle key={id++} fill={posColor} cx={x + vw[w] + 0.5} cy={y + 0.5} r={0.5} />)
                        }
                        for (let h = 0; h < vh.length; h++) {
                            pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + vh[h] + 0.5} r={0.5} />)
                        }
                    }
                }

            }
            else if (typeTable[x][y] == QRPointType.POS_OTHER) {
                if (qrcode.isDark(x, y)) {
                    if (posType == PosType.Rect) {
                        pointList.push(<rect width={1} height={1} key={id++} fill={posColor} x={x} y={y}/>);
                    }
                } else {
                    if (posType == PosType.Rect) {
                        pointList.push(<rect width={1} height={1} key={id++} fill="white" x={x} y={y}/>);
                    }
                }

            }
            else {
                if (qrcode.isDark(x, y)) {
                    if (type == Type.Rect)
                        pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={darkColor} x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                    else if (type == Type.Round)
                        pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={darkColor} cx={x + 0.5} cy={y + 0.5}/>)
                } else {
                    if (type == Type.Rect)
                        pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={lightColor} x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                    else if (type == Type.Round)
                        pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={lightColor} cx={x + 0.5} cy={y + 0.5}/>)
                }

            }
        }
    }

    return pointList;
}

QRImage.defaultCSS = {
    svg: {
    }
}

QRImage.defaultProps =  {
    image: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    type: Type.Rect,
    size: 100,
    opacity: 100,
    darkColor: "#000000",
    lightColor: "#FFFFFF",
    posType: PosType.Rect,
    posColor: "#000000",
}

export default RendererWrapper(QRImage);
