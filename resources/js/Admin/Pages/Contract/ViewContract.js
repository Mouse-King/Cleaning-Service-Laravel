import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ContractEng from '../../Components/contract/ContractEng'
import ContractHeb from '../../Components/contract/ContractHeb'
export default function WorkContract() {

    const param = useParams();
    const [lng, setLng] = useState([]);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getContract = () => {
        axios
            .post(`/api/admin/get-contract`, { id: param.id }, { headers })
            .then((res) => {
                setLng(res.data.contract[0].client.lng)
            })
    }
    useEffect(() => {
        getContract();
    }, [])

    return (
        (lng == 'heb') ? <ContractHeb />: <ContractEng />

    )

}
