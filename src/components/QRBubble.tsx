import React from 'react';
import { getTypeTable, QRPointType } from '../utils/qrcodeHandler';
import { RendererWrapper, RendererProps, SFC } from './RendererWrapper';
import { defaultViewBox, rand } from "../utils/helper";

interface QRBubbleProps extends RendererProps {
    circleColor?: string,
    posColor?: string
}

const QRBubble: SFC<QRBubbleProps> = (props) => {
    const { qrcode, className, styles } = props;
    return (
        <svg className={className} style={styles.svg} width="100%" height="100%" viewBox={defaultViewBox(qrcode)} fill="white"
            xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            {listPoints(props)}
        </svg>
    );
}

function listPoints({ qrcode, circleColor, posColor }: QRBubbleProps) {
    if (!qrcode) return []

    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = [];
    const g1 = [];
    const g2 = [];

    let id = 0;

    circleColor = circleColor!;
    posColor = posColor!;

    let available: Array<Array<boolean>> = [];
    let ava2: Array<Array<boolean>> = [];
    for (let x = 0; x < nCount; x++) {
        available[x] = [];
        ava2[x] = [];
        for (let y = 0; y < nCount; y++) {
            available[x][y] = true;
            ava2[x][y] = true;
        }
    }

    for (let y = 0; y < nCount; y++) {
        for (let x = 0; x < nCount; x++) {

            if (qrcode.isDark(x, y) && typeTable[x][y] === QRPointType.POS_CENTER) {
                pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
                pointList.push(<circle key={id++} fill="none" strokeWidth="1" stroke={posColor} cx={x + 0.5}
                    cy={y + 0.5} r={3} />)
            }
            else if (qrcode.isDark(x, y) && typeTable[x][y] === QRPointType.POS_OTHER) {
            }
            else {
                if (available[x][y] && ava2[x][y] && x < nCount - 2 && y < nCount - 2) {
                    let ctn = true;
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (ava2[x + i][y + j] === false) {
                                ctn = false;
                            }
                        }
                    }
                    if (ctn && qrcode.isDark(x + 1, y) && qrcode.isDark(x + 1, y + 2) && qrcode.isDark(x, y + 1) && qrcode.isDark(x + 2, y + 1)) {
                        g1.push(<circle key={id++} cx={x + 1 + 0.5} cy={y + 1 + 0.5} r={1} fill="#FFFFFF" stroke={circleColor} strokeWidth={rand(0.33, 0.6)} />)
                        if (qrcode.isDark(x + 1, y + 1)) {
                            g1.push(<circle r={0.5 * rand(0.5, 1)} key={id++} fill={circleColor} cx={x + 1 + 0.5} cy={y + 1 + 0.5} />)
                        }
                        available[x + 1][y] = false;
                        available[x][y + 1] = false;
                        available[x + 2][y + 1] = false;
                        available[x + 1][y + 2] = false;
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                ava2[x + i][y + j] = false;
                            }
                        }
                    }
                }
                if (x < nCount - 1 && y < nCount - 1) {
                    if (qrcode.isDark(x, y) && qrcode.isDark(x + 1, y) && qrcode.isDark(x, y + 1) && qrcode.isDark(x + 1, y + 1)) {
                        g1.push(<circle key={id++} cx={x + 1} cy={y + 1} r={Math.sqrt(1 / 2)} fill="#FFFFFF" stroke={circleColor} strokeWidth={rand(0.33, 0.6)} />)
                        for (let i = 0; i < 2; i++) {
                            for (let j = 0; j < 2; j++) {
                                available[x + i][y + j] = false;
                                ava2[x + i][y + j] = false;
                            }
                        }
                    }
                }
                if (available[x][y] && y < nCount - 1) {
                    if (qrcode.isDark(x, y) && qrcode.isDark(x, y + 1)) {
                        pointList.push(<circle key={id++} cx={x + 0.5} cy={y + 1} r={0.5 * rand(0.95, 1.05)} fill="#FFFFFF" stroke={circleColor} strokeWidth={rand(0.36, 0.4)} />)
                        available[x][y] = false;
                        available[x][y + 1] = false;
                    }
                }
                if (available[x][y] && x < nCount - 1) {
                    if (qrcode.isDark(x, y) && qrcode.isDark(x + 1, y)) {
                        pointList.push(<circle key={id++} cx={x + 1} cy={y + 0.5} r={0.5 * rand(0.95, 1.05)} fill="#FFFFFF" stroke={circleColor} strokeWidth={rand(0.36, 0.4)} />)
                        available[x][y] = false;
                        available[x + 1][y] = false;
                    }
                }
                if (available[x][y]) {
                    if (qrcode.isDark(x, y)) {
                        pointList.push(<circle r={0.5 * rand(0.5, 1)} key={id++} fill={circleColor} cx={x + 0.5} cy={y + 0.5} />)
                    } else if (typeTable[x][y] === QRPointType.DATA) {
                        if (rand(0, 1) > 0.85) {
                            g2.push(<circle r={0.5 * rand(0.85, 1.3)} key={id++} fill="#FFFFFF" stroke={circleColor} strokeWidth={rand(0.15, 0.33)} cx={x + 0.5} cy={y + 0.5} />)
                        }
                    }
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

QRBubble.defaultCSS = {
    svg: {
    }
}

QRBubble.defaultProps = {
    circleColor: '#8ED1FC',
    posColor: '#0693E3'
}

export default RendererWrapper(QRBubble)
