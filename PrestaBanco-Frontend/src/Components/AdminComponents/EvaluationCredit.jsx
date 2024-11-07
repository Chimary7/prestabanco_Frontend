import { useState, useEffect } from "react";
import calculateService from "../../Services/calculate.service"
import userService from "../../Services/user.service";
import creditService from "../../Services/credit.service";
import pdfFileService from "../../Services/pdfFile.service";
import { useNavigate } from "react-router-dom";

export default function EvaluationCredit(){
    const navigate = useNavigate();
    const [cuota, setCuota] = useState([]);
    const [user, setUser] = useState([]);
    const [relacionCuotaIngreso, setRelacionCuotaIngreso] = useState('');
    const [BooleanAgeRequired,setBooleanAgeRequired] = useState(false);
    const [creditDetail, setCreditDetail] = useState('');
    const [isChecked, setIsChecked] = useState({ creditHistory: false, debtLevel: false, jobAntiquity: false, jobStability: false });
    const [relacionDeudaIngreso, setRelacionDeudaIngreso] = useState('');
    const [allConditionsMet, setAllConditionsMet] = useState(false);

    const [deudas, setDeudas] = useState([]);
    const [nuevoMontoDeuda, setNuevoMontoDeuda] = useState('');

    useEffect(() => {
        // Retrieve credit data from localStorage
        const storedCredit = JSON.parse(localStorage.getItem('Credit'))?.data;
        console.log("Stored Credit:", storedCredit); // Check what's stored
        if (storedCredit) {
            if (storedCredit.creditEvaluation) {
                navigate('/admin/home/solicitud/savinghistory');
            } else {
                setCreditDetail(storedCredit);
            }
        } else {
            console.log("No hay datos de crédito en localStorage.");
            navigate('/admin/home/solicitudes');
        }
    }, []);

    useEffect(() => {
        const allConditions =
            BooleanAgeRequired &&
            relacionCuotaIngreso <= 35 &&
            Object.values(isChecked).every(Boolean) &&
            relacionDeudaIngreso <= 50;
    
        setAllConditionsMet(allConditions);
    }, [BooleanAgeRequired, relacionCuotaIngreso, isChecked, relacionDeudaIngreso]);

    useEffect(() => {

        if (creditDetail) {
            console.log("Credit detail updated:", creditDetail); // Log updated detail
            fetchUserData(creditDetail.rutClient);
        }
    }, [creditDetail]);

    const fetchUserData = async (rut) => {
        try {
            const response = await userService.getRut(rut);
            setUser(response.data);
    
            const formattedBirthdate = new Date(response.data.birthdate).toISOString().split('T')[0];
            const response2 = await calculateService.getEdadSolicitante(formattedBirthdate, creditDetail.timePay);
            setBooleanAgeRequired(response2.data); // Actualiza el estado con el resultado
            console.log("Edad requerida:", response2.data);

            await calcularRelacionCuotaIngreso(response.data.ingreso);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const calcularRelacionCuotaIngreso = async (ingreso) => {
        try {
            
            const monto = creditDetail.amountTotal * (creditDetail.maxPorcentFinancy / 100);
            const interes = creditDetail.porcentInterest;
            const plazo = creditDetail.timePay;

            console.log("Monto:", monto, "Interés:", interes, "Plazo:", plazo, "Ingreso:", ingreso);

            // Get cuota using the calculateService
            const cuotaResponse = await calculateService.getCalculate(monto, interes, plazo);
            setCuota(cuotaResponse.data); // Assuming cuota is in response.data

            // Now get the cuotaIngreso
            const cuotaIngresoResponse = await calculateService.getCuotaIngreso(cuotaResponse.data, ingreso);
            setRelacionCuotaIngreso(cuotaIngresoResponse.data);
        } catch (error) {
            console.error("Error al calcular la relación cuota/ingreso", error);
        }
    };

    //descarga archivo pero no me permite ver su contenido
    const downloadFile = async (category, idCredit, fileName) => {
        try {
            const response = await pdfFileService.getPdfCategoryByCreditId(category, idCredit);
            const blob = new Blob([response.data], { type: 'application/pdf' }); // Blob with the correct type
    
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Suggested filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    const handleEvaluationCreditAccept = () => {
        // Actualiza el estado de creditDetail y luego envía la solicitud de actualización
        setCreditDetail((prevCreditDetail) => {
            const updatedCreditDetail = { ...prevCreditDetail, creditEvaluation: true };
            creditService.update(updatedCreditDetail)
                .then(() => {
                    localStorage.setItem('Credit', JSON.stringify(updatedCreditDetail)); // Guarda el objeto actualizado en localStorage
                    console.log("Crédito actualizado:", updatedCreditDetail);
                    navigate('/admin/home/solicitud/savinghistory');
                })
                .catch((error) => {
                    console.error("Se ha producido un error al intentar evaluar la solicitud de crédito", error);
                });
            return updatedCreditDetail;
        });
    };

    const handleEvaluationCreditReject = () => {
        const updatedCreditDetail = { ...creditDetail, processCredit: false, creditStatus: 'RECHAZADA'
        };
        creditService.update(updatedCreditDetail)
            .then(() => {
                navigate('/admin/home/solicitudes');
            })
            .catch((error) => {
                console.log("Se ha producido un error al intentar evaluar la solicitud de crédito", error);
            });
    }
    
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setIsChecked((prevState) => ({
            ...prevState,
            [name]: checked, // Set the checkbox's value directly to true or false
        }));
    };

    const calcularRelacionDeudaIngreso = async () => {
        const deudaTotal = deudas.reduce((acc, deuda) => acc + deuda, 0);
        try {
            const relacionResponse = await calculateService.getDeudaIngreso(cuota, deudaTotal, user.ingreso);
            setRelacionDeudaIngreso(relacionResponse.data);
        } catch (error) {
            console.error("Error calculando relación deuda/ingreso", error);
        }
    };

    const agregarDeuda = (e) => {
        e.preventDefault();
        if (nuevoMontoDeuda) {
            setDeudas([...deudas, parseFloat(nuevoMontoDeuda)]);
            setNuevoMontoDeuda('');
        }
    };

    const handlePendingDocumentation = () => {
        const updatedCredit = {
            ...creditDetail,
            creditStatus: "PENDIENTE_DE_DOCUMENTACION"
        }
        creditService.update(updatedCredit)
        .then(() => navigate('/admin/home/solicitudes'))
        .catch((error) => console.error("Error al actualizar a documentación pendiente:", error));
    };
    return (
        <div className="w-full h-full flex flex-col items-center p-4 space-y-4 bg-gray-200">
            <h1 className="text-2xl font-bold text-gray-700">Evaluación de Crédito</h1>
            <div className="bg-white shadow-md rounded-lg w-full h-5/6 flex p-4 space-x-4">
                <div className="w-1/2 h-full space-y-4">
                    <div className="w-full h-1/3 flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-gray-600 p-4">Historial Crediticio</h2>
                        <button
                            onClick={() => downloadFile('Historial Crediticio', creditDetail.id, 'Historial_Crediticio.pdf')}
                            className="text-white underline-none text-sm mt-1 bg-black"
                        >
                            Descargar archivo historial crediticio
                        </button>
                        <div className="flex space-x-2 mt-2 text-sm text-gray-500 flex flex-col justify-center items-center">
                            <label className="p-2">
                            <input 
                                type="checkbox" 
                                name="creditHistory"
                                checked={isChecked.creditHistory}
                                onChange={handleCheckboxChange}
                                className="mr-1 bg-white" />
                                Sin morosidades graves
                            </label>
                            <label className="p-2">
                            <input 
                                type="checkbox" 
                                name="debtLevel"
                                checked={isChecked.debtLevel}
                                onChange={handleCheckboxChange}
                                className="mr-1 bg-white"/>
                                Sin alta cantidad de deudas
                            </label>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-600">Datos del Préstamo</h2>
                        <div className="text-sm text-gray-500">
                            <p>Monto Total: {creditDetail.amountTotal}</p>
                            <p>Porcentaje Financiamiento: {creditDetail.maxPorcentFinancy}%</p>
                            <p>monto prestamo: {(creditDetail.amountTotal) * (creditDetail.maxPorcentFinancy/100)}</p>
                            <p>Interés: {creditDetail.porcentInterest}%</p>
                            <p>Plazo: {creditDetail.timePay} años</p>
                        </div>
                    </div>
                    <div className="w-full h-1/3 flex flex-col item-centers justify-center">
                        <h2 className="font-semibold text-gray-600 p-4">Información del Cliente</h2>
                        <div className="text-sm text-gray-500">
                            <p className="p-2">RUT: {user.rut}</p>
                            <p className="p-2">Nombre: {user.name}</p>
                            <p className="p-2">Apellido: {user.lastname}</p>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 h-full space-y-4">
                    <div>
                        <h2 className="font-semibold text-gray-600">Relación Cuota / Ingreso</h2>
                        <div className="text-sm text-gray-500">
                            <p>Cuota: {cuota}</p>
                            <p>Ingreso: {user.ingreso}</p>
                            <p>Relación cuota/ingreso: {relacionCuotaIngreso}%</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-600">Antigüedad Laboral y Estabilidad</h2>
                        <button
                            onClick={() => downloadFile('historial cuenta de ahorro', creditDetail.id, 'Comprobante_Ingresos.pdf')}
                            className="text-white underline-none text-sm mt-1 bg-black"
                        >
                            Descargar archivo cuenta de ahorro
                        </button>
                        <div className="flex space-x-2 mt-2 text-sm text-gray-500">
                            <label>
                            <input 
                                type="checkbox" 
                                name="jobAntiquity"
                                checked={isChecked.jobAntiquity}
                                onChange={handleCheckboxChange}
                                className="mr-1 bg-white"/>
                                Confirmar antigüedad laboral de 2 o mas años
                            </label>
                            <label>
                            <input 
                                type="checkbox" 
                                name="jobStability"
                                checked={isChecked.jobStability}
                                onChange={handleCheckboxChange}
                                className="mr-1 bg-white"/>
                                Confirmar estabilidad laboral
                            </label>
                        </div>
                    </div>
                    <div>
                    <h2 className="font-semibold text-gray-600 p-4">Edad cercana a jubilacion (75 años)</h2>
                    {BooleanAgeRequired ? (
                        <div className="bg-green-200 rounded-md p-4 border border-green-400">
                            <p className="text-sm text-green-600 font-bold">La edad del solicitante cumple con no ser cercana a la edad de jubilacion</p>
                        </div>
                    ) : ( <div className="bg-red-200 rounded-md p-4 border border-red-400">
                        <p className="text-sm text-red-600 font-bold">La edad del solicitante no cumple con no ser cercana a la edad de jubilacion</p>
                    </div>
                    )}
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-600 p-4">Relacion deuda/Ingreso</h2>
                        <div className="flex justify-between p-2">
                            <form onSubmit={agregarDeuda} className="h-full w-1/2">
                                <input 
                                    type="number" 
                                    value={nuevoMontoDeuda}
                                    onChange={(e) => setNuevoMontoDeuda(e.target.value)}
                                    placeholder="Ingrese monto de deuda"
                                    className="p-2 border border-custom-blue-light bg-white rounded-md m-2 text-black"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Agregar Deuda</button>
                            </form>
                            <ul className="mt-2 bg-gray-100 p-1 w-1/2 h-24 overflow-y-auto border border-gray-300 rounded-lg">
                                {deudas.map((deuda, index) => (
                                    <li key={index} className="text-sm text-gray-700">{deuda}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="h-full w-full flex items-center justify-center">
                            <button onClick={calcularRelacionDeudaIngreso} className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2">
                                Calcular Relación
                            </button>
                            <p className="text-black px-5">Relación deuda/ingreso (%): {relacionDeudaIngreso}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex space-x-4 w-full justify-between items-center bg-white p-4 rounded-md shadow-md">
                <button
                    onClick={handleEvaluationCreditReject}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg w-1/4"
                >
                    Rechazar
                </button>
                <button
                    onClick={handlePendingDocumentation}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg w-1/4"
                    >
                    Documentación Pendiente
                </button>
                {allConditionsMet && (
                    <button
                        onClick={handleEvaluationCreditAccept}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg w-1/4"
                    >
                        Aprobar Evaluación Crediticia
                    </button>
                )}
            </div>
        </div>
    );
}