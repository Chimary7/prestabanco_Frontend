import { useEffect, useState } from "react";
import loanService from "../../Services/loan.service";
import creditService from "../../Services/credit.service";

export default function CreditConsult(){
    const [credit, setCredit] = useState([]);
    const [user, setUser] = useState([]);
    const [rutClient, setRutClient] = useState('');

    useEffect(() => {
        creditService.getCreditProcessByRut(rutClient)
        .then((response) => {
            setCredit(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [rutClient]);

    const formatRUT = (rut) => {
        let cleanRUT = rut.replace(/[^0-9kK]/g, '').toUpperCase();
        let formattedRUT = '';
        if(cleanRUT.length > 1){
            const bodyRUT = cleanRUT.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            const checkDigit = cleanRUT.slice(-1);
            formattedRUT = `${bodyRUT}-${checkDigit}`;
        } else{
            formattedRUT = cleanRUT;
        }
        return formattedRUT;
    };

    const formatNumber = (number) => {
        // Parseamos el número y luego lo formateamos para que el usuario vea los puntos
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
        }).format(number);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'rutClient'){
            setRutClient(formatRUT(value));
        }
    }


    return(
        <div className="w-full h-full">
            <div className="h-full w-full flex flex-col items-center">
                <h1 className="text-custom-blue-light p-2">estado del credito</h1>
                <div className="flex w-full h-full bg-red-100">
                    <div className="w-1/2 h-full p-4 bg-green-400 overflow-hidden">
                        <div className="bg-blue-200 h-min p-2">
                            <form className="w-full h-full flex flex-col items-center justify-center">
                                <label className="font-bold text-custom-blue-light w-full p-2">ingrese su rut:</label>
                                <input
                                    type="text"
                                    name="rutClient"
                                    value={rutClient}
                                    onChange={handleChange}
                                    placeholder="RUT"
                                    className="w-2/3 mx-4 p-2 border text-black bg-white rounded-md border-custom-blue-light focus:outline-none focus:ring-2 focus:ring-custom-blue-light focus:border-transparent"
                                    maxLength={12}
                                />
                                <button className="mt-4 p-2 px-5 bg-blue-700 text-white rounded-3xl" type='submit'>Enviar</button>
                            </form>
                        </div>
                        <div className="w-full h-5/6 p-2 pb-10 bg-blue-700">
                            { credit && (
                                <div className="w-full h-full bg-pink-400">
                                    <div>
                                        <h2>Datos del cliente: </h2>
                                        <p>
                                            {user.name} {user.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <h2>Estado del crédito</h2>
                                        <div>
                                            <p>{credit.status}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-1/2 h-full p-4 bg-yellow-400">
                            {   credit && (
                                <div>
                                    <h2>Detalle del crédito</h2>
                                    <div>
                                        <p>Monto del crédito: {formatNumber(credit.amount)}</p>
                                        <p>Fecha de solicitud: {credit.date}</p>
                                        <p>Estado del crédito: {credit.status}</p>
                                        
                                    </div>
                                    <div>
                                        <button>
                                            <p className="text-white">Cancelar credito</p>
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}