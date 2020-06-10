import React from 'react';
import ReactDOM from 'react-dom';
import { default as QRNormal} from "./components/QRNormal";
import { default as QR25D } from "./components/QR25D";
import { default as QRDsj } from "./components/QRDsj";
import { default as QRRandRect } from "./components/QRRandRect";
import { default as QRImage } from "./components/QRImage";
import { default as QRResImage } from "./components/QRResImage";

ReactDOM.render(
    <QRResImage value={"dashfuahfuidasf"} otherColor={"#a11e1e"}/>,
    document.getElementById('root')
);
