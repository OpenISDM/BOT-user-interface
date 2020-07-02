/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        styleComponent.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import styled from 'styled-components';
import Item from 'react-bootstrap/ListGroupItem';
import Link from 'react-bootstrap/NavLink'
import NavLink from 'react-bootstrap/NavLink'
import Nav from 'react-bootstrap/Nav'
import styleSheet from '../../config/styleSheet'
import Button from 'react-bootstrap/Button';
import DataTimePicker from 'react-widgets/lib/DateTimePicker';

export const EditedTime = styled.div`
    font-size: 0.8em;
    display: flex;
    align-items: flex-end;
    padding-left: 5px;
    color: #999;
`;

export const Primary = styled.div`
    font-size: 1em;
    font-weight: 600;
    color: black;
`

export const Paragraph = styled.p`
    text-align: justify;
    text-justify:inter-ideograph;
    color: black;
`

export const FormFieldName = styled.div`
    color: black;
    font-size: .8rem;
    margin-bottom: 5px;
    text-transform: capitalize;
`

export const FieldLabel = styled.div`
    color: ${styleSheet.grey};
    font-size: .8rem;
    margin-bottom: 5px;
    text-transform: capitalize;
    font-weight: 600;
`

export const PageTitle = styled.div`
    color: black;
    font-size: 1.4rem;
    font-weight: 450;
    text-transform: capitalize;
    margin-bottom: 1rem;
`

export const ListTitle = styled.div`
    text-transform: capitalize;
    font-size: 1.2rem;
    font-weight: 400;
    color: black;
`

export const SubTitle = styled.div`
    font-size: 1rem;
    font-weight: 400;
    color: black;
    margin-bottom: 5px;
`

export const BOTContainer = styled.div`
    margin: 20px 20px;
`

export const CenterContainer = styled.div`
    width: 400px;
    height: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -300px 0 0 -200px;
`

export const BOTSideNav = styled(NavLink)`
    font-size: 1rem;
    font-weight: 500;
    text-transform: capitalize;
    letter-spacing: 1.2px;
    border-radius: 5px;
    margin-top: 0.5rem;
    color: ${styleSheet.inActive};
    &:hover {
        color: ${styleSheet.theme};
    }
    &:active {
        color: ${styleSheet.theme};
    }
    &.active {
        color: ${styleSheet.theme};
    }
`

export const BOTSideNavTitle = styled.div`
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: black;
    text-transform: capitalize;
`

export const BOTNavLink = styled(Link)`
    font-weight: 500;
    text-transform: capitalize;
    color: ${styleSheet.inActive};
    &.active {
        color: ${styleSheet.theme};
        border-bottom: 3px solid ${styleSheet.theme};
        border-radius: 0px;
    }
    &:hover {
        color: ${styleSheet.theme};
    }
`

export const BOTNav = styled(Nav)`
    border-bottom: 1px solid ${styleSheet.lightGrey};
    margin-bottom: 0;
`

export const LoaderWrapper = styled.div`
    position: absolute;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${props => props.backdrop && 'rgb(255,255,255,0.8)'};
`

export const PrimaryButton = styled(Button)`
    font-size: 1rem;
    padding: 0.375rem 0.5rem;
    height: 3rem;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0 .2rem;
`

export const NoDataFoundDiv = styled.div`
    padding: 10px 20px;
    background: white;
    text-transform: capitalize;
`

export const BOTDataTimePicker = styled(DataTimePicker)`
    height: 3rem;
`