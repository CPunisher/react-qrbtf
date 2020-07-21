import React from 'react';
import {rand, defaultViewBox} from '../utils/helper';
import { getTypeTable, QRPointType } from '../utils/qrcodeHandler';
import {RendererWrapper, RendererProps, SFC, drawIcon} from './RendererWrapper';

enum Type {
    Rect = 'rect',
    Dsj = 'dsj'
}

interface QRDsjProps extends RendererProps {
    scale?: number,
    crossWidth?: number,
    posWidth?: number,
    posType?: Type | string,
}

const QRDsj: SFC<QRDsjProps> = (props) => {
    const { qrcode, className, styles } = props;
    return (
        <svg className={className} style={styles.svg} width="100%" height="100%" viewBox={defaultViewBox(qrcode)} fill="white"
             xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            {listPoints(props)}
            {drawIcon(props)}
        </svg>
    );
}


function listPoints({ qrcode, scale, crossWidth, posWidth, posType}: QRDsjProps) {
    if (!qrcode) return []

    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = [];
    const g1 = [];
    const g2 = [];


    scale = scale! / 100;
    crossWidth = crossWidth! / 100;
    posWidth = posWidth! / 100;
    posType = posType!;
    let id = 0;

    let available: Array<Array<boolean>> = [];
    let available2: Array<Array<boolean>> = [];
    for (let x = 0; x < nCount; x++) {
        available[x] = [];
        available2[x] = [];
        for (let y = 0; y < nCount; y++) {
            available[x][y] = true;
            available2[x][y] = true;
        }
    }

    for (let y = 0; y < nCount; y++) {
        for (let x = 0; x < nCount; x++) {
            if (qrcode.isDark(x, y) == false) continue;

            else if (typeTable[x][y] == QRPointType.POS_CENTER) {
                if (posType == Type.Rect) {
                    pointList.push(<rect width={1} height={1} key={id++} fill="#0B2D97" x={x} y={y}/>);
                } else if (posType == Type.Dsj) {
                    pointList.push(<rect width={3 - (1 - posWidth)} height={3 - (1 - posWidth)} key={id++} fill="#0B2D97" x={x - 1 + (1 - posWidth)/2} y={y - 1 + (1 - posWidth)/2}/>);
                    pointList.push(<rect width={posWidth} height={3 - (1 - posWidth)} key={id++} fill="#0B2D97" x={x - 3 + (1 - posWidth)/2} y={y - 1 + (1 - posWidth)/2}/>);
                    pointList.push(<rect width={posWidth} height={3 - (1 - posWidth)} key={id++} fill="#0B2D97" x={x + 3 + (1 - posWidth)/2} y={y - 1 + (1 - posWidth)/2}/>);
                    pointList.push(<rect width={3 - (1 - posWidth)} height={posWidth} key={id++} fill="#0B2D97" x={x - 1 + (1 - posWidth)/2} y={y - 3 + (1 - posWidth)/2}/>);
                    pointList.push(<rect width={3 - (1 - posWidth)} height={posWidth} key={id++} fill="#0B2D97" x={x - 1 + (1 - posWidth)/2} y={y + 3 + (1 - posWidth)/2}/>);
                }
            }
            else if (typeTable[x][y] == QRPointType.POS_OTHER) {
                if (posType == Type.Rect) {
                    pointList.push(<rect width={1} height={1} key={id++} fill="#0B2D97" x={x} y={y}/>);
                }
            }
            else {
                if (available[x][y] && available2[x][y]  && x < nCount - 2 && y < nCount - 2) {
                    let ctn = true;
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (available2[x + i][y + j] === false) {
                                ctn = false;
                            }
                        }
                    }
                    if (ctn && qrcode.isDark(x + 2, y) && qrcode.isDark(x + 1, y + 1) && qrcode.isDark(x, y + 2) && qrcode.isDark(x + 2, y + 2)) {
                        g1.push(<line key={id++} x1={x + crossWidth / Math.sqrt(8)} y1={y + crossWidth / Math.sqrt(8)} x2={x + 3 - crossWidth / Math.sqrt(8)} y2={y + 3 - crossWidth / Math.sqrt(8)} fill="none" stroke="#0B2D97" strokeWidth={crossWidth} />)
                        g1.push(<line key={id++} x1={x + 3 - crossWidth / Math.sqrt(8)} y1={y + crossWidth / Math.sqrt(8)} x2={x + crossWidth / Math.sqrt(8)} y2={y + 3 - crossWidth / Math.sqrt(8)} fill="none" stroke="#0B2D97" strokeWidth={crossWidth} />)
                        available[x][y] = false;
                        available[x + 2][y] = false;
                        available[x][y + 2] = false;
                        available[x + 2][y + 2] = false;
                        available[x + 1][y + 1] = false;
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                available2[x + i][y + j] = false;
                            }
                        }
                    }
                }
                if (available[x][y] && available2[x][y] && x < nCount - 1 && y < nCount - 1) {
                    let ctn = true;
                    for (let i = 0; i < 2; i++) {
                        for (let j = 0; j < 2; j++) {
                            if (available2[x + i][y + j] === false) {
                                ctn = false;
                            }
                        }
                    }
                    if (ctn && qrcode.isDark(x + 1, y) && qrcode.isDark(x, y + 1) && qrcode.isDark(x + 1, y + 1)) {
                        g1.push(<line key={id++} x1={x + crossWidth / Math.sqrt(8)} y1={y + crossWidth / Math.sqrt(8)} x2={x + 2 - crossWidth / Math.sqrt(8)} y2={y + 2 - crossWidth / Math.sqrt(8)} fill="none" stroke="#0B2D97" strokeWidth={crossWidth} />)
                        g1.push(<line key={id++} x1={x + 2 - crossWidth / Math.sqrt(8)} y1={y + crossWidth / Math.sqrt(8)} x2={x + crossWidth / Math.sqrt(8)} y2={y + 2 - crossWidth / Math.sqrt(8)} fill="none" stroke="#0B2D97" strokeWidth={crossWidth} />)
                        for (let i = 0; i < 2; i++) {
                            for (let j = 0; j < 2; j++) {
                                available[x + i][y + j] = false;
                                available2[x + i][y + j] = false;
                            }
                        }
                    }
                }
                if (available[x][y] && available2[x][y]) {
                    if (y === 0 || (y > 0 && (!qrcode.isDark(x, y - 1) || !available2[x][y - 1]))) {
                        let start = y;
                        let end = y;
                        let ctn = true;
                        while (ctn && end < nCount) {
                            if (qrcode.isDark(x, end) && available2[x][end]) {
                                end++;
                            } else {
                                ctn = false;
                            }
                        }
                        if (end - start > 2) {
                            for (let i = start; i < end; i++) {
                                available2[x][i] = false;
                                available[x][i] = false;
                            }
                            g2.push(<rect width={scale} height={end - start - 1 - (1 - scale)} key={id++} fill="#E02020" x={x + (1 - scale)/2} y={y + (1 - scale)/2}/>)
                            g2.push(<rect width={scale} height={scale} key={id++} fill="#E02020" x={x + (1 - scale)/2} y={end - 1 + (1 - scale)/2}/>)
                        }
                    }
                }
                if (available[x][y] && available2[x][y]) {
                    if (x === 0 || (x > 0 && (!qrcode.isDark(x - 1, y) || !available2[x - 1][y]))) {
                        let start = x;
                        let end = x;
                        let ctn = true;
                        while (ctn && end < nCount) {
                            if (qrcode.isDark(end, y) && available2[end][y]) {
                                end++;
                            } else {
                                ctn = false;
                            }
                        }
                        if (end - start > 1) {
                            for (let i = start; i < end; i++) {
                                available2[i][y] = false;
                                available[i][y] = false;
                            }
                            g2.push(<rect width={end - start - (1 - scale)} height={scale} key={id++} fill="#F6B506" x={x + (1 - scale)/2} y={y + (1 - scale)/2}/>)
                        }
                    }
                }
                if (available[x][y]) {
                    pointList.push(<rect width={scale} height={scale} key={id++} fill="#F6B506" x={x + (1 - scale)/2} y={y + (1 - scale)/2}/>)
                }


            }
        }
    }

    for (let i = 0; i < g1.length; i++) {
        pointList.push(g1[i]);
    }
    for (let i = 0; i < g2.length; i++) {
        pointList.push(g2[i]);
    }

    return pointList;
}

QRDsj.defaultCSS = {
    svg: {
    }
}

QRDsj.defaultProps =  {
    scale: 70,
    crossWidth: 70,
    posWidth: 90,
    posType: Type.Dsj,
}

export default RendererWrapper(QRDsj);
