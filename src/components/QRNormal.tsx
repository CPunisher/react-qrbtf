import React from 'react';
import {rand, defaultViewBox} from '../utils/helper';
import { getTypeTable, QRPointType } from '../utils/qrcodeHandler';
import {RendererWrapper, RendererProps, SFC} from './RendererWrapper';

enum Type {
    Rect = 'rect',
    Round = 'round',
    Rand = 'rand'
}

enum PosType {
    Rect = 'rect',
    Round = 'round',
    Planet = 'planet',
    RoundRect = 'roundRect'
}

interface QRNormalProps extends RendererProps {
    type?: Type | string,
    posType?: PosType | string,
    size?: number,
    opacity?: number,
    otherColor?: string,
    posColor?: string,
}

const QRNormal: SFC<QRNormalProps> = (props) => {
    const { qrcode, className, styles } = props;
    return (
        <svg className={className} style={styles.svg} width="100%" height="100%" viewBox={defaultViewBox(qrcode)} fill="white"
        xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            {listPoints(props)}
        </svg>
    );
}


function listPoints({ qrcode, type, size, opacity, posType, otherColor, posColor }: QRNormalProps) {
    if (!qrcode) return []

    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = new Array(nCount);

    size = size! / 100;
    opacity = opacity! / 100;
    let id = 0;

    const vw = [3, -3];
    const vh = [3, -3];
    const sq25 = "M32.048565,-1.29480038e-15 L67.951435,1.29480038e-15 C79.0954192,-7.52316311e-16 83.1364972,1.16032014 87.2105713,3.3391588 C91.2846454,5.51799746 94.4820025,8.71535463 96.6608412,12.7894287 C98.8396799,16.8635028 100,20.9045808 100,32.048565 L100,67.951435 C100,79.0954192 98.8396799,83.1364972 96.6608412,87.2105713 C94.4820025,91.2846454 91.2846454,94.4820025 87.2105713,96.6608412 C83.1364972,98.8396799 79.0954192,100 67.951435,100 L32.048565,100 C20.9045808,100 16.8635028,98.8396799 12.7894287,96.6608412 C8.71535463,94.4820025 5.51799746,91.2846454 3.3391588,87.2105713 C1.16032014,83.1364972 5.01544207e-16,79.0954192 -8.63200256e-16,67.951435 L8.63200256e-16,32.048565 C-5.01544207e-16,20.9045808 1.16032014,16.8635028 3.3391588,12.7894287 C5.51799746,8.71535463 8.71535463,5.51799746 12.7894287,3.3391588 C16.8635028,1.16032014 20.9045808,7.52316311e-16 32.048565,-1.29480038e-15 Z";

    if (size <= 0) size = 1.0

    for (let x = 0; x < nCount; x++) {
        for (let y = 0; y < nCount; y++) {
            if (qrcode.isDark(x, y) == false) continue;

            if (typeTable[x][y] == QRPointType.ALIGN_CENTER || typeTable[x][y] == QRPointType.ALIGN_OTHER || typeTable[x][y] == QRPointType.TIMING) {
                if (type == Type.Rect)
                    pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={otherColor} x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                else if (type == Type.Round)
                    pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5}/>)
                else if (type == Type.Rand)
                    pointList.push(<circle key={id++} opacity={opacity} fill={otherColor} cx={x + 0.5} cy={y + 0.5} r={size / 2} />)
            }
            else if (typeTable[x][y] == QRPointType.POS_CENTER) {
                if (posType == PosType.Rect) {
                    pointList.push(<rect width={1} height={1} key={id++} fill={posColor} x={x} y={y}/>);
                } else if (posType == PosType.Round) {
                    pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
                    pointList.push(<circle key={id++} fill="none" strokeWidth="1" stroke={posColor}  cx={x + 0.5} cy={y + 0.5} r={3} />)
                } else if (posType == PosType.Planet) {
                    pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
                    pointList.push(<circle key={id++} fill="none" strokeWidth="0.15" strokeDasharray="0.5,0.5" stroke={posColor}  cx={x + 0.5} cy={y + 0.5} r={3} />)
                    for (let w = 0; w < vw.length; w++) {
                        pointList.push(<circle key={id++} fill={posColor} cx={x + vw[w] + 0.5} cy={y + 0.5} r={0.5} />)
                    }
                    for (let h = 0; h < vh.length; h++) {
                        pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + vh[h] + 0.5} r={0.5} />)
                    }
                }
            } else if (posType === PosType.RoundRect) {
                pointList.push(<circle key={id++} fill={posColor} cx={x + 0.5} cy={y + 0.5} r={1.5} />)
                pointList.push(<path key={id++} d={sq25} stroke={posColor} strokeWidth={100/6 * (1 - (1 - size) * 0.75)} fill="none" transform={'translate('+String(x - 2.5)+','+String(y - 2.5)+') ' + 'scale(' + String(6/100) + ',' + String(6/100) + ')'} />)
            }
            else if (typeTable[x][y] == QRPointType.POS_OTHER) {
                if (posType == PosType.Rect) {
                    pointList.push(<rect width={1} height={1} key={id++} fill={posColor} x={x} y={y}/>);
                }
            }
            else {
                if (type == Type.Rect)
                    pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill={otherColor} x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                else if (type == Type.Round)
                    pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5}/>)
                else if (type == Type.Rand)
                    pointList.push(<circle opacity={opacity} key={id++} fill={otherColor} cx={x + 0.5} cy={y + 0.5} r={0.5 * rand(0.33,1.0)} />)
            }
        }
    }

    return pointList;
}

QRNormal.defaultCSS = {
    svg: {
    }
}

QRNormal.defaultProps =  {
    styles: {},
    type: Type.Rect,
    size: 100,
    opacity: 100,
    posType: PosType.Rect,
    otherColor: '#000000',
    posColor: '#000000',
}

export default RendererWrapper(QRNormal);
