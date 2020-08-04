import React from 'react';
import { getTypeTable, QRPointType } from '../utils/qrcodeHandler';
import { RendererWrapper, RendererProps, SFC } from './RendererWrapper';
import QRCode from "../utils/qrcode";

interface QR25DProps extends RendererProps {
    height?: number,
    posHeight?: number,
    topColor?: string,
    leftColor?: string,
    rightColor?: string
}

const QR25D: SFC<QR25DProps> = (props) => {
    const { qrcode, className, styles } = props;
    return (
        <svg className={className} style={styles.svg} width="100%" height="100%" viewBox={getViewBox(qrcode)} fill="white"
            xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            {listPoints(props)}
        </svg>
    );
}

function getViewBox(qrcode: QRCode | undefined) {
    if (!qrcode) return '0 0 0 0';

    const nCount = qrcode.getModuleCount();
    return String(-nCount) + ' ' + String(-nCount / 2) + ' ' + String(nCount * 2) + ' ' + String(nCount * 2);
}

function listPoints({ qrcode, height, posHeight, topColor, leftColor, rightColor }: QR25DProps) {
    if (!qrcode) return []

    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = new Array(nCount);

    let size = 1.001;
    let size2 = 1.001;
    height = height!;
    posHeight = posHeight!;
    topColor = topColor!;
    leftColor = leftColor!;
    rightColor = rightColor!;

    let id = 0;

    const X = [-Math.sqrt(3) / 2, 1 / 2];
    const Y = [Math.sqrt(3) / 2, 1 / 2];
    const Z = [0, 0];

    const matrixString = 'matrix(' + String(X[0]) + ', ' + String(X[1]) + ', ' + String(Y[0]) + ', ' + String(Y[1]) + ', ' + String(Z[0]) + ', ' + String(Z[1]) + ')'

    if (height <= 0) height = 1.0;
    if (posHeight <= 0) posHeight = 1.0;

    for (let x = 0; x < nCount; x++) {
        for (let y = 0; y < nCount; y++) {
            if (qrcode.isDark(x, y) === false) continue;
            else if (typeTable[x][y] === QRPointType.POS_OTHER || typeTable[x][y] === QRPointType.POS_CENTER) {
                pointList.push(<rect width={size2} height={size2} key={id++} fill={topColor} x={x + (1 - size2) / 2} y={y + (1 - size2) / 2} transform={matrixString} />);
                pointList.push(<rect width={posHeight} height={size2} key={id++} fill={leftColor} x={0} y={0} transform={matrixString + 'translate(' + String(x + (1 - size2) / 2 + size2) + ',' + String(y + (1 - size2) / 2) + ') skewY(45) '} />);
                pointList.push(<rect width={size2} height={posHeight} key={id++} fill={rightColor} x={0} y={0} transform={matrixString + 'translate(' + String(x + (1 - size2) / 2) + ',' + String(y + size2 + (1 - size2) / 2) + ') skewX(45) '} />);
            }
            else {
                pointList.push(<rect width={size} height={size} key={id++} fill={topColor} x={x + (1 - size) / 2} y={y + (1 - size) / 2} transform={matrixString} />);
                pointList.push(<rect width={height} height={size} key={id++} fill={leftColor} x={0} y={0} transform={matrixString + 'translate(' + String(x + (1 - size) / 2 + size) + ',' + String(y + (1 - size) / 2) + ') skewY(45) '} />);
                pointList.push(<rect width={size} height={height} key={id++} fill={rightColor} x={0} y={0} transform={matrixString + 'translate(' + String(x + (1 - size) / 2) + ',' + String(y + size + (1 - size) / 2) + ') skewX(45) '} />);
            }
        }
    }

    return pointList;
}

QR25D.defaultCSS = {
    svg: {
    }
}

QR25D.defaultProps = {
    height: 0.5,
    posHeight: 0.5,
    topColor: "#FF7F89",
    leftColor: "#FFD7D9",
    rightColor: "#FFEBF3",
}

export default RendererWrapper(QR25D)
